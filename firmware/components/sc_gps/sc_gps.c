#include "sc_gps.h"
#include <stdio.h>
#include <esp_log.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/uart.h"
#include "driver/gpio.h"
#include "compass_data.h"

#define TAG "sc_gps"
#define BUF_SIZE (2048)
#define WAIT_TIME_MS (1000)

void uart_read_task(void *arg) 
{
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

  uint8_t *line = (uint8_t *)malloc(BUF_SIZE);
  int char_in_line_count = 0;

  while (1) {
    int length = 0;
    ESP_ERROR_CHECK(uart_get_buffered_data_len(uart_num, (size_t*)&length));
    // ESP_LOGI(TAG, "Amount: %d", length);
    for (int i = 0; i < length; i++) {
      uart_read_bytes(uart_num, &line[char_in_line_count], 1, 20 / portTICK_PERIOD_MS);
      if (line[char_in_line_count] != '\n') {
        char_in_line_count++;
        continue;
      }
      if (line[0] != '$' || line[1] != 'G' || line[2] != 'P' || line[3] != 'G' || line[4] != 'G' ||
          line[5] != 'A') {
          char_in_line_count = 0;
          continue;
      }
      line[char_in_line_count + 1] = 0;
      // ESP_LOGI(TAG, "Raw: %s", &line[7]);

      float time = 0, latitude = 0, longitude = 0;
      char north_south, east_west;
      int satelites_amount = 0;
      sscanf((char *) &line[7], "%f,%f,%c,%f,%c,%d", 
             &time, 
             &latitude, 
             &north_south, 
             &longitude, 
             &east_west,
             &satelites_amount);
      // ESP_LOGI(TAG, "Parsed: %f,%f\nSatelites:%d\n", latitude, longitude, satelites_amount);
      if (satelites_amount != 0) {
        decode_gnss(&latitude, &longitude, north_south, east_west);
      }
      update_position(latitude, longitude, satelites_amount);
      char_in_line_count = 0;
    }      
    vTaskDelay(WAIT_TIME_MS / portTICK_PERIOD_MS);
  } 
}

void decode_gnss(float * lat, float * lon, char north_south, char west_east) 
{
  int lat_degrees = (int) (*lat / 100);
  int lon_degrees = (int) (*lon / 100);
  float lat_minutes = (*lat - (float) lat_degrees * 100) / 60; 
  float lon_minutes = (*lon - (float) lon_degrees * 100) / 60; 
  *lat = (float) lat_degrees + lat_minutes;
  *lon = (float) lon_degrees + lon_minutes; 
  if (north_south == 'S') {
    *lat *= -1;
  }
  if (west_east == 'W') {
    *lon *= -1;
  }
}

void update_position(float latitude, float longitude, int satelites_amount) 
{
  compass_data_t *compass_data_ptr = &compass_data;
  if (xSemaphoreTake(compass_data_ptr->mutex, portMAX_DELAY) == pdTRUE) {
    ESP_LOGI(TAG, "Updated (%d): %f, %f", satelites_amount,latitude, longitude);
    if (satelites_amount == 0) {
      compass_data_ptr->position_updated = false;
    }
    else {
      compass_data_ptr->position.lat = latitude;
      compass_data_ptr->position.lon = longitude;
      compass_data_ptr->position_updated = true;
    }
    xSemaphoreGive(compass_data_ptr->mutex);
  }
}

void sc_gps_init() {
// Initialize GPS
  xTaskCreate(uart_read_task, "uart_echo_task", 2048, NULL, 10, NULL);
}
