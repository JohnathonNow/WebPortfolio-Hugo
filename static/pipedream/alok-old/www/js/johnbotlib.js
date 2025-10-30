function IllegalArgumentException(message)
{
    this.name = "IllegalArgumentException";
    this.message = message;
}
function letterFromA(index)
{
    if (index <   0) throw new IllegalArgumentException("index must be non-negative");
    if (index >= 26) throw new IllegalArgumentException("index must be less than 26");
    return String.fromCharCode( 'A'.charCodeAt(0) + index );
}
function normalizeAngle(angle)
{
    while (angle>360)
        angle -= 360;
    while (angle<  0)
        angle += 360;
    return angle;
}
function doNothing(arg)
{

}