// Sine oscillator at 220 Hz (updating from global variable)
SinOsc osc => dac;
220.0 => global float freq;

while (true) {
    freq => osc.freq;
    1::ms => now;
}