#ifndef SMART_COMPASS_SC_GPS_H
#define SMART_COMPASS_SC_GPS_H

void sc_gps_init();
void update_position(float latitude, float longitude, int satelites_amount);
void decode_gss(float *, float *, char, char);

#endif //SMART_COMPASS_SC_GPS_H
