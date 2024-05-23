#include <sys/cdefs.h>
#include "sc_compass.h"

// Includes
#include "esp_log.h"
#include "driver/i2c.h"

// Defines
#define TAG "sc_compass"
#define I2C_MASTER_NUM 1
#define I2C_MASTER_TIMEOUT_MS 1000

// Bus variables
uint16_t compass_address;

static uint16_t autodetect_address() {
    return 0x0D; // Default address QMC5883L
}

static uint8_t compass_read_register(uint8_t reg) {
    uint8_t send_buf[8] = {0};
    uint8_t read_buf[8] = {0};
    // Set pointer to register
    send_buf[0] = reg; // Write mode
    send_buf[1] = reg; //  Location
    i2c_master_write_read_device(I2C_MASTER_NUM, compass_address, send_buf, 1, read_buf, 1,
                                 pdMS_TO_TICKS(I2C_MASTER_TIMEOUT_MS));
    return read_buf[0];
}

static void compass_read_registers(uint8_t *buf, uint8_t len) {
    for (uint8_t i = 0; i < len; ++i) {
        buf[i] = compass_read_register(i);
    }
}

static void compass_read_data_registers(uint8_t *buf) {
    uint8_t send_buf[1] = {0x00}; // First compass data register
    ESP_ERROR_CHECK(i2c_master_write_read_device(I2C_MASTER_NUM, compass_address, send_buf, 1, buf, 6,
                                                 -1));
}

static void configure_device() {
    ESP_LOGI(TAG, "Configuring device...");
    // Write to mode register
    uint8_t send_buf[8] = {0};
    send_buf[0] = 0x09; // Mode register
    send_buf[1] = 0x01; // Continuous mode
    ESP_ERROR_CHECK(i2c_master_write_to_device(I2C_MASTER_NUM, compass_address, send_buf, 2,
                                               -1));
    // Read all registers
    uint8_t reg_buf[12] = {0};
    compass_read_registers(reg_buf, 12);
    ESP_LOG_BUFFER_HEX(TAG, reg_buf, 12);
}

_Noreturn static void sc_compass_task(void *args) {
    int16_t output[3];
    while (1) {
        vTaskDelay(pdMS_TO_TICKS(100));
        compass_read_data_registers((uint8_t *) output);
        ESP_LOGI(TAG, "X: %d, Y: %d, Z: %d", output[0], output[1], output[2]);
    }
}

void sc_compass_init() {
    ESP_LOGI(TAG, "Initializing I2C bus and device...");

    int i2c_master_port = I2C_MASTER_NUM;
    i2c_config_t conf = {
            .mode = I2C_MODE_MASTER,
            .sda_io_num = CONFIG_I2C_SDA,
            .sda_pullup_en = GPIO_PULLUP_DISABLE,
            .scl_io_num = CONFIG_I2C_SCL,
            .scl_pullup_en = GPIO_PULLDOWN_DISABLE,
            .master.clk_speed = CONFIG_I2C_SCL_SPEED_HZ,
    };

    ESP_ERROR_CHECK(i2c_param_config(i2c_master_port, &conf));
    ESP_ERROR_CHECK(i2c_driver_install(i2c_master_port, conf.mode, 0, 0, 0));
    ESP_LOGI(TAG, "I2C bus initialized");
    // Add device
    vTaskDelay(pdMS_TO_TICKS(500)); // Wait for device to boot
#ifdef CONFIG_COMPASS_AUTODETECT_ADDR
    compass_address = autodetect_address();
#else
    compass_address = CONFIG_COMPASS_ADDR;
#endif
    ESP_LOGI(TAG, "Compass connected at address %2x", compass_address);
    // Configure device
    configure_device();
    ESP_LOGI(TAG, "Compass initialized");
    // Start task
    xTaskCreate(sc_compass_task, "sc_compass_task", 4096, NULL, 1, NULL);
    ESP_LOGI(TAG, "Task started");
};