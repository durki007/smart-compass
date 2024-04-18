# SmartCompass Firmware
## About
This is the firmware for the ESP32 microcontroller that is part of the **Smart Compass** project.
> BLE configuration is based on the [ESP-IDF nimble/bleprph example](https://github.com/espressif/esp-idf/tree/5a40bb8746633477c07ff9a3e90016c37fa0dc0c/examples/bluetooth/nimble/bleprph)
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
- [ESP-IDF Build System](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-guides/build-system.html)