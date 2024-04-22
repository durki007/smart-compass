#include "sc_compass.h"

// Includes
#include "esp_log.h"
#include "driver/i2c.h"
#include "driver/i2c_master.h"

// Defines
#define TAG "sc_compass"

void sc_compass_init() {
    ESP_LOGI(TAG, "Initializing I2C bus and device...");
    i2c_master_bus_config_t i2c_mst_conf = {
        .clk_source = I2C_CLK_SRC_APB,
        .i2c_port = I2C_NUM_1,
        .scl_io_num = CONFIG_I2C_SCL,
        .sda_io_num = CONFIG_I2C_SDA,
        .glitch_ignore_cnt = 7,
        .flags.enable_internal_pullup = false,
    };
    i2c_master_bus_handle_t bus_handle;
    ESP_ERROR_CHECK(i2c_new_master_bus(&i2c_mst_conf, &bus_handle));
    i2c_device_config_t dev_cfg = {
        .dev_addr_length = I2C_ADDR_BIT_LEN_7,
        .device_address = CONFIG_COMPASS_ADDR,
        .scl_speed_hz = CONFIG_I2C_SCL_SPEED_HZ,
    };
    i2c_master_dev_handle_t dev_handle;
    ESP_ERROR_CHECK(i2c_master_bus_add_device(bus_handle, &dev_cfg, &dev_handle));
    // Check if device is connected
    vTaskDelay(pdMS_TO_TICKS(500));
    ESP_ERROR_CHECK(i2c_master_probe(bus_handle, 0x1e, -1));
    ESP_LOGI(TAG, "Device %2x connected", CONFIG_COMPASS_ADDR);
};