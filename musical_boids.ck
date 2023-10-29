0 => global int num_boids;
0 => global int width;
0 => global int height;

global int x_pos[num_boids];
global int y_pos[num_boids];

// Simple depo where we map the average horizontal coordinate of
// the boids to the pan and the vertical coordinate to the reverb

TriOsc osc => ADSR env1 => NRev rev => Pan2 pan => dac;

0.2 => rev.mix;

1.0 => pan.pan;

0.25::second => dur beat;
0.25 => osc.gain;
(1::ms, beat/8, 0, 1::ms) => env1.set;

[0, 4, 7] @=> int major[];
[0, 3, 7] @=> int minor[];

60 => int offset;
int position;

while(true)
{
    for(0 => int i; i < 10; 1 +=> i)
    {
        beat / Math.random2(2, 16) => env1.decayTime;
        Math.random2(0, 3) * 12 => position;
        0.0 => float avg_x;
        0.0 => float avg_y;
        for(0 => int j; j < x_pos.size(); j++)
        {
           x_pos[j] +=> avg_x;
           y_pos[j] +=> avg_y;
        }
        avg_x / x_pos.size() => avg_x;
        avg_y / y_pos.size() => avg_y;
        Math.map(avg_x, 0, width, -1, 1) => float panValue;
        Math.map(avg_y, 0, height, 0, 1) => float mixValue;
        Math.random2(0, minor.size() - 1) => int note;
        panValue => pan.pan;
        mixValue => rev.mix;
        Std.mtof(minor[0] + offset + position) => osc.freq;
        1 => env1.keyOn;
        beat / 2 => now;
    }
}