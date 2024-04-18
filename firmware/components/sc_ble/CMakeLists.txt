idf_component_register(
        SRCS "sc_ble.c" "gatt_svr.c"
        INCLUDE_DIRS "include"
        REQUIRES bt nvs_flash nimble_peripheral_utils
)