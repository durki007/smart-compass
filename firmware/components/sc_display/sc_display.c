#include <sys/cdefs.h>
#include "sc_display.h"

#include <stdlib.h>
#include <esp_timer.h>
#include <freertos/FreeRTOS.h>
#include "esp_log.h"
#include "compass_data.h"

#include "freertos/task.h"
#include "esp_freertos_hooks.h"
#include "freertos/semphr.h"

#ifdef LV_LVGL_H_INCLUDE_SIMPLE

#include "lvgl.h"

#else
#include "lvgl/lvgl.h"
#endif

#include "lvgl_helpers.h"
#include "widgets/lv_img.h"
#include "arrow.h"

#define TAG "sc_display"
#define LV_TICK_PERIOD_MS 1

_Noreturn static void guiTask(void *pvParameter);

static void lv_tick_task(void *arg);

static void create_ui(void);

static void ui_refresh_task();

void sc_display_init() {
    ESP_LOGI(TAG, "Init");
    xTaskCreatePinnedToCore(guiTask, "gui", 4096 * 2, NULL, 0, NULL, 1);
}

SemaphoreHandle_t xGuiSemaphore;

_Noreturn static void guiTask(void *pvParameter) {
    (void) pvParameter;
    xGuiSemaphore = xSemaphoreCreateMutex();

    // Initialize lvgl
    lv_init();
    lvgl_driver_init();

    // Initialize draw buffer
    lv_color_t *buf1 = heap_caps_malloc(DISP_BUF_SIZE * sizeof(lv_color_t), MALLOC_CAP_DMA);
    assert(buf1 != NULL);
    lv_color_t *buf2 = heap_caps_malloc(DISP_BUF_SIZE * sizeof(lv_color_t), MALLOC_CAP_DMA);
    assert(buf2 != NULL);
    static lv_disp_draw_buf_t disp_buf;
    uint32_t size_in_px = DISP_BUF_SIZE;
    lv_disp_draw_buf_init(&disp_buf, buf1, buf2, size_in_px);

    // Initialize display driver
    lv_disp_drv_t disp_drv;
    lv_disp_drv_init(&disp_drv);
    disp_drv.flush_cb = disp_driver_flush;
    disp_drv.draw_buf = &disp_buf;
    disp_drv.hor_res = CONFIG_LV_HOR_RES_MAX;
    disp_drv.ver_res = CONFIG_LV_VER_RES_MAX;
#if defined CONFIG_DISPLAY_ORIENTATION_PORTRAIT || defined CONFIG_DISPLAY_ORIENTATION_PORTRAIT_INVERTED
    disp_drv.rotated = 1;
#endif
    lv_disp_drv_register(&disp_drv);

    // Create and start a periodic timer interrupt to call lv_tick_inc
    const esp_timer_create_args_t periodic_timer_args = {
            .callback = &lv_tick_task,
            .name = "periodic_gui"
    };
    esp_timer_handle_t periodic_timer;
    ESP_ERROR_CHECK(esp_timer_create(&periodic_timer_args, &periodic_timer));
    ESP_ERROR_CHECK(esp_timer_start_periodic(periodic_timer, LV_TICK_PERIOD_MS * 1000));

    // Create the UI and UI refresh task
    create_ui();
    lv_timer_create(ui_refresh_task, 100, NULL);

    // Event loop
    while (1) {
        vTaskDelay(pdMS_TO_TICKS(10));
        if (pdTRUE == xSemaphoreTake(xGuiSemaphore, portMAX_DELAY)) {
            lv_task_handler();
            lv_timer_handler();
            xSemaphoreGive(xGuiSemaphore);
        }
    }
    /* A task should NEVER return */
    free(buf1);
    free(buf2);
    vTaskDelete(NULL);
}

static lv_obj_t *img;
static lv_obj_t *label;
static lv_obj_t *pos_lat_label;
static lv_obj_t *pos_lon_label;

static void ui_refresh_task() {
    uint16_t angle = lv_img_get_angle(img);
    angle += 10;
    if (angle >= 3600) {
        angle = 0;
    }
    lv_img_set_angle(img, (int16_t) angle);
    // Format the angle to a string
//    char buf[10];
//    snprintf(buf, 10, "%d", angle / 10);
//    lv_label_set_text(label, buf);

    // Format the position to a string
    compass_data_t *compass_data_ptr = &compass_data;
    if (xSemaphoreTake(compass_data_ptr->mutex, pdMS_TO_TICKS(5)) == pdTRUE) {
        // Update the position labels
        if (compass_data_ptr->position_updated) {
            char pos_lat_buf[20];
            snprintf(pos_lat_buf, 20, "N %f", compass_data_ptr->position.lat);
            lv_label_set_text(pos_lat_label, pos_lat_buf);
            char pos_lon_buf[20];
            snprintf(pos_lon_buf, 20, "E %f", compass_data_ptr->position.lon);
            lv_label_set_text(pos_lon_label, pos_lon_buf);
        } else {
            lv_label_set_text(pos_lat_label, "Position: N/A");
            lv_label_set_text(pos_lon_label, "Position: N/A");
        }
        // Update main label with path length
        char path_length_buf[20];
        snprintf(path_length_buf, 20, "Path len: %lu", compass_data_ptr->path.length);
        lv_label_set_text(label, path_length_buf);
        xSemaphoreGive(compass_data_ptr->mutex);
    }
}

static void create_ui(void) {
    LV_IMG_DECLARE(arrow);
    lv_obj_set_style_bg_color(lv_scr_act(), lv_color_hex(0xffffff), LV_PART_MAIN);
    lv_obj_set_layout(lv_scr_act(), LV_LAYOUT_FLEX);
    lv_obj_set_flex_flow(lv_scr_act(), LV_FLEX_FLOW_COLUMN);
    lv_obj_set_flex_align(lv_scr_act(), LV_FLEX_ALIGN_CENTER, LV_FLEX_ALIGN_CENTER, LV_FLEX_ALIGN_CENTER);

    img = lv_img_create(lv_scr_act());
    lv_img_set_src(img, &arrow);
    lv_img_set_angle(img, 200);
    lv_obj_align(img, LV_ALIGN_CENTER, 0, 0);

    /*Create a white label, set its text and align it to the center*/
    label = lv_label_create(lv_scr_act());
    lv_label_set_text(label, "1000m");
    lv_obj_set_style_text_color(lv_scr_act(), lv_color_hex(0x000000), LV_PART_MAIN);
    lv_obj_align(label, LV_ALIGN_CENTER, 0, 0);

    // Create a label for position
    pos_lat_label = lv_label_create(lv_scr_act());
    lv_label_set_text(pos_lat_label, "Position: 0, 0");
    lv_obj_align(pos_lat_label, LV_ALIGN_CENTER, 0, 0);
    pos_lon_label = lv_label_create(lv_scr_act());
    lv_label_set_text(pos_lon_label, "Position: 0, 0");
    lv_obj_align(pos_lon_label, LV_ALIGN_CENTER, 0, 0);
}

static void lv_tick_task(void *arg) {
    (void) arg;

    lv_tick_inc(LV_TICK_PERIOD_MS);
}
