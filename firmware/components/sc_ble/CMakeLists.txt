idf_component_register(
        SRCS "sc_ble.c"
        INCLUDE_DIRS "include"
        REQUIRES bt nvs_flash
)