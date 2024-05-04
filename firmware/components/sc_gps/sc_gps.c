#include "sc_gps.h"
#include <stdio.h>
#include <esp_log.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/uart.h"
#include "driver/gpio.h"

#define TAG "sc_gps"
#define BUF_SIZE (1024)

void uart_read_task(void *arg) {
    const uart_port_t uart_num = UART_NUM_2;
    uart_config_t uart_config = {
            .baud_rate = 9600,
            .data_bits = UART_DATA_8_BITS,
            .parity = UART_PARITY_DISABLE,
            .stop_bits = UART_STOP_BITS_1,
            .flow_ctrl = UART_HW_FLOWCTRL_DISABLE,
            .source_clk = UART_SCLK_DEFAULT,
    };

    ESP_ERROR_CHECK(uart_driver_install(uart_num, BUF_SIZE * 2, 0, 0, NULL, 0));
    ESP_ERROR_CHECK(uart_param_config(uart_num, &uart_config));
    ESP_ERROR_CHECK(uart_set_pin(uart_num, 17, 16, UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE));

    ESP_LOGI(TAG, "UART init done");
    uart_flush(uart_num);

    uint8_t *data = (uint8_t *) malloc(BUF_SIZE);
    int char_in_line_count = 0;

    while (1) {
        int length = 0;
        length = uart_read_bytes(uart_num, &data[char_in_line_count], 1, 20 / portTICK_PERIOD_MS);
//        ESP_LOGI(TAG, "Read %d bytes: %c", length, data[char_in_line_count]);

        if (length == 0) {
            continue;
        }

        ESP_LOGI(TAG, "Read %d bytes: %c", length, data[char_in_line_count]);
        if (data[char_in_line_count] == '\n') {
            if (data[0] != '$' || data[1] != 'G' || data[2] != 'P' || data[3] != 'G' || data[4] != 'G' ||
                data[5] != 'A') {
                char_in_line_count = 0;
                continue;
            }

            data[char_in_line_count + 1] = 0;
            printf("%s", &data[7]);
            ESP_LOGI(TAG, "Raw: %s", &data[7]);

            float time = 0, latitude = 0, longitude = 0;
            char north_south, east_west;
            int satelites_amount;
            sscanf((char *) &data[7], "%f,%f,%c,%f,%c,%d", &time, &latitude, &north_south, &longitude, &east_west,
                   &satelites_amount);
            ESP_LOGI(TAG, "Parsed: %f,%f\nSatelites:%d\n", latitude, longitude, satelites_amount);
            char_in_line_count = 0;
            continue;
        }

        char_in_line_count++;
    }
}

void sc_gps_init() {
    // Initialize GPS
    xTaskCreate(uart_read_task, "uart_echo_task", 2048, NULL, 10, NULL);
}
