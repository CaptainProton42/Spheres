class HorizontalCoordinates {
    constructor(azimuth, altitude) {
        this.azimuth = azimuth;
        this.altitude = altitude;
    };

    fromRestingEquatorial( input, latitude )
    {
        var denom = Math.sin(latitude) * Math.cos(input.hourAngle) - Math.cos(latitude) * Math.tan(input.declination);  // thats all a bit hacky still, need to look into that
        this.azimuth = Math.atan( Math.sin(input.hourAngle) / denom );
        if ( denom > 0 )
        {
            this.azimuth -= Math.PI;
        }
        if ( this.azimuth < -Math.PI )
        {
            this.azimuth += 2*Math.PI;
        }
        this.altitude = Math.asin(Math.sin(latitude) * Math.sin(input.declination)  + Math.cos(latitude) * Math.cos(input.declination) * Math.cos(hourAngle));
    };
}

class RestingEquatorialCoordinates {
    constructor(hourAngle, declination) {
        this.hourAngle = hourAngle;
        this.declination = declination;
    }
}

class RotatingEquatorialCoordinates {
    constructor(rightAscension, declination) {
        this.rightAscension = rightAscension;
        this.declination = declination;
    }
}