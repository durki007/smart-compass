#include "esp_log.h"
#include "nvs_flash.h"

#include "sc_ble.h"
#include "sc_display.h"
#include "sc_compass.h"


void
app_main(void)
{
//    ESP_LOGI("main", "BLE init");
//    sc_ble_init();
//    sc_display_init();
    sc_compass_init();
}
