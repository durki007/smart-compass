#include <sys/cdefs.h>
#include <freertos/FreeRTOS.h>
#include "sc_compass.h"

// Includes
#include "esp_log.h"
//#include "driver/i2c.h"
#include "driver/i2c_master.h"
#include "compass_data.h"

// Defines
#define TAG "sc_compass"

// Bus variables
uint16_t compass_address;
i2c_master_bus_handle_t bus_handle;
i2c_master_dev_handle_t dev_handle;


static uint16_t autodetect_address() {
    for (uint16_t i = 0; i < 127; ++i) {
        int ret = i2c_master_probe(bus_handle, i, 10);
        if (ret == ESP_OK) {
            ESP_LOGI(TAG, "Detected device %2x", i);
            return i;
        } else {
            ESP_LOGI(TAG, "No device at %2x", i);
        }
    }
    ESP_ERROR_CHECK(ESP_ERR_NOT_FOUND);
    return 0;
}

static uint8_t compass_read_register(uint8_t reg) {
    uint8_t send_buf[8] = {0};
    uint8_t read_buf[8] = {0};
    // Set pointer to register
    send_buf[0] = reg; // Write mode
    send_buf[1] = reg; //  Location
    ESP_ERROR_CHECK(i2c_master_transmit_receive(dev_handle, send_buf, 1, read_buf, 1, 10));
    return read_buf[0];
}

static void compass_read_registers(uint8_t *buf, uint8_t len) {
    for (uint8_t i = 0; i < len; ++i) {
        buf[i] = compass_read_register(i);
    }
}

static void compass_read_data_registers(uint8_t *buf) {
    uint8_t send_buf[1] = {0x00}; // First compass data register
    ESP_ERROR_CHECK(i2c_master_transmit_receive(dev_handle, send_buf, 1, buf, 6, 10));
}

static void configure_device() {
    ESP_LOGI(TAG, "Configuring device...");
    // Write to mode register
    uint8_t send_buf[8] = {0};
    send_buf[0] = 0x09; // Mode register
    send_buf[1] = 0x01; // Continuous mode
    ESP_ERROR_CHECK(i2c_master_transmit(dev_handle, send_buf, 2, 10));
    // Read all registers
    uint8_t reg_buf[12] = {0};
    compass_read_registers(reg_buf, 12);
    ESP_LOG_BUFFER_HEX(TAG, reg_buf, 12);
}

_Noreturn static void sc_compass_task(void *args) {
    int16_t output[3];
    while (1) {
        vTaskDelay(pdMS_TO_TICKS(CONFIG_COMPASS_REFRESH_PERIOD_MS));
        compass_read_data_registers((uint8_t *) output);
        ESP_LOGI(TAG, "X: %d, Y: %d, Z: %d", output[0], output[1], output[2]);
        // Update bearing in shared data
        int16_t bearing = output[CONFIG_COMPASS_AXIS_INDEX];
        sc_update_bearing(bearing);
    }
}

void sc_compass_init() {
    ESP_LOGI(TAG, "Initializing I2C bus and device...");
    // Empty bus (?)
    i2c_master_bus_config_t i2c_mst_mock_conf = {
            .clk_source = I2C_CLK_SRC_DEFAULT,
            .i2c_port = I2C_NUM_0,
            .scl_io_num = CONFIG_I2C_SCL,
            .sda_io_num = CONFIG_I2C_SDA,
            .glitch_ignore_cnt = 7,
            .flags.enable_internal_pullup = false,
    };
    i2c_master_bus_handle_t mock_handle;
    ESP_ERROR_CHECK(i2c_new_master_bus(&i2c_mst_mock_conf, &mock_handle));
    i2c_master_bus_config_t i2c_mst_conf = {
            .clk_source = I2C_CLK_SRC_DEFAULT,
            .i2c_port = I2C_NUM_1,
            .scl_io_num = 22,
            .sda_io_num = 21,
            .glitch_ignore_cnt = 7,
            .flags.enable_internal_pullup = false,
    };
    ESP_LOGI(TAG, "I2C bus configuration set");
    vTaskDelay(pdMS_TO_TICKS(1000));
    ESP_ERROR_CHECK(i2c_new_master_bus(&i2c_mst_conf, &bus_handle));
    vTaskDelay(pdMS_TO_TICKS(1000));
    ESP_LOGI(TAG, "I2C bus initialized");
    // Add device
#ifdef CONFIG_COMPASS_AUTODETECT_ADDR
    compass_address = autodetect_address();
#else
    compass_address = CONFIG_COMPASS_ADDR;
#endif
//    compass_address = 0x0d;
    i2c_device_config_t dev_cfg = {
            .dev_addr_length = I2C_ADDR_BIT_LEN_7,
            .device_address = compass_address,
            .scl_speed_hz = CONFIG_I2C_SCL_SPEED_HZ,
    };
    ESP_ERROR_CHECK(i2c_master_bus_add_device(bus_handle, &dev_cfg, &dev_handle));
    // Check if device is connected
    ESP_ERROR_CHECK(i2c_master_probe(bus_handle, compass_address, 10));
    ESP_LOGI(TAG, "Compass connected at address %2x", compass_address);
    // Configure device
    configure_device();
    ESP_LOGI(TAG, "Compass initialized");
    // Start task
//    xTaskCreate(sc_compass_task, "sc_compass_task", 4096, NULL, 1, NULL);
    xTaskCreatePinnedToCore(sc_compass_task, "sc_compass_task", 4096, NULL, 1, NULL, 0);
    ESP_LOGI(TAG, "Task started");
};