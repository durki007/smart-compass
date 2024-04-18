#include "esp_log.h"
#include "nvs_flash.h"

#include "sc_ble.h"


void
app_main(void)
{
    ESP_LOGI("main", "Hello World");
    sc_ble_init();
}
