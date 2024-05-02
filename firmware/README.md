# SmartCompass Firmware
## About
This is the firmware for the ESP32 microcontroller that is part of the **Smart Compass** project.
> BLE configuration is based on the [ESP-IDF nimble/bleprph example](https://github.com/espressif/esp-idf/tree/5a40bb8746633477c07ff9a3e90016c37fa0dc0c/examples/bluetooth/nimble/bleprph)

## Project structure
The project is organized as follows:
```
firmware/ 
│   main/ -- Application code entry point
│   components/
│   ├── sc_ble      -- BLE configuration and services
│   ├── sc_compass  -- Compass sensor driver
│   ├── sc_display  -- Display driver
│   ├── sc_gps      -- GPS sensor driver
```
The `main` folder contains the entry point of the application. All tasks are created and initialized here.

The `components` folder contains the drivers for the sensors and the BLE configuration.
Each component defines a set of functions to initialize, read, and write data to the sensor.

### Third party components
Refer to `.gitmodules` for exact information. 
>To avoid dependency issues, use the correct versions of components.

Components used:
- [lvgl v8.3](https://github.com/lvgl/lvgl.git)
- [lvgl_esp32_drivers](https://github.com/hiruna/lvgl_esp32_drivers.git)
Fork by [hiruna](https://github.com/hiruna) with some modifications to work with the latest version of `lvgl` and `esp-idf v.5.2`.
## Build
#### Prerequisites
- [ESP-IDF v.5.2.1](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/get-started/index.html#manual-installation)
- [Python 3.11.2](https://www.python.org/downloads/release/python-3112/)
> When using `ESP-IDF-v5.2.1`: `Python3.11.2` must be used. This is related to a known [issue](https://github.com/espressif/esp-idf/issues/12519).
### Using ESP-IDF
Set target to `esp32`:
```bash
idf.py set-target esp32
```
Build
```bash
idf.py build
```
### CMake on Windows
#### Prerequisites
- [CMake](https://cmake.org/download/)
- Ninja (or other build system)
- [ESP-IDF v.5.2.1](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/get-started/index.html#manual-installation)
with all related environment variables set.

Generate build files
```bash
mkdir build 
cd build
cmake -G Ninja ..
```
Build
```bash
ninja
```
All commands normally provided by `idf.py` can be used with `cmake` and `ninja` as well. For example, to configure the device:
```bash
ninja menuconfig
```

## Flash
```bash
idf.py -p PORT flash
```
Where `PORT` is the serial port where the ESP32 is connected. For example, on Windows, it could be `COM3`.

## References
- [ESP-IDF v5.2.1](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/get-started/index.html#manual-installation)
- [ESP-IDF Build System](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-guides/build-system.html) -- Building the project, configuring the device, defining components etc.