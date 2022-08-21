from p5 import *
from lib import *
import time
import builtins

builtins.pixel_x_density = 4
builtins.pixel_y_density = 4

PIXEL_SIZE = 18
TILE_HEIGHT = 20
TILE_WIDTH = 24

background_pixels = None
background_img = None
pixels_lst = []
constant_pixels_lst = []


class Pixel:
    def __init__(self, x1, y1, x2, y2, col):
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2
        self.curr_x = x1
        self.curr_y = y1
        self.col = 255 if col == 1 else 0

    def animate(self, t):
        self.curr_x = ((1-t)*self.x1) + (t*self.x2)
        self.curr_y = ((1-t)*self.y1) + (t*self.y2)

    def draw(self):
        fill(self.col)
        square(
            self.curr_x * PIXEL_SIZE,
            self.curr_y * PIXEL_SIZE,
            PIXEL_SIZE
        )


def setup():
    size(
        PIXEL_SIZE * TILE_WIDTH,
        PIXEL_SIZE * TILE_HEIGHT,
    )
    background(128)

    df1 = clamp_df_to_binary(load_img_to_df(img_1))
    df2 = clamp_df_to_binary(load_img_to_df(img_2))

    diff = df1 - df2
    coords_of_wb, coords_of_bw = get_pixel_diff_lists(diff)
    coords_of_constant_w, coords_of_constant_b = get_coords_of_constant(df1, diff)
    coords_of_excess_pixels, coords_of_wb, coords_of_bw = get_excess_pixels(
        coords_of_wb,
        coords_of_bw,
        diff
    )

    # Randomly pair pixels to be exchanged
    pixel_pairs = list(zip(
        random.sample(coords_of_wb, len(coords_of_wb)),
        random.sample(coords_of_bw, len(coords_of_bw)))
    )

    # for x in range(len(df1.columns)):
    #     for y in range(len(df1.index)):
    #         pixels.append(Pixel(x, y, x, y, df1.iloc[y, x]))

    for p in coords_of_excess_pixels:
        col = 1 if diff.sum().sum() > 0 else 0
        # TODO Handle movement and replacement for excess pixels
        # Health bar (balance / ratio of white to black)
        # N farthest left columns are reserved to handle excess
        # Bottom half is black, top half is white
        # Exact ratio fluctuates as excess pixels are exchanged
        # For each image transition, bar will move up xor down
        # Pixels are only exchanged where the white and black meet
        # rather than the top or bottom edges
        pixels_lst.append(Pixel(*p, *p, col))

    for p in coords_of_constant_b:
        constant_pixels_lst.append(Pixel(*p, *p, 0))

    for p in coords_of_constant_w:
        constant_pixels_lst.append(Pixel(*p, *p, 1))

    for wb, bw in pixel_pairs:
        pixels_lst.append(Pixel(*wb, *bw, 1))
        pixels_lst.append(Pixel(*bw, *wb, 0))



def draw():
    background(128)
    rect_mode(CENTER)

    # TODO Optimize by not rerendering constant pixels, current 1.67 FPS
    t = (sin(millis()*0.5/1000) + 1) / 2

    global background_img

    if background_img is None:
        for pixel in constant_pixels_lst:
            pixel.draw()
        save_frame()
        background_img = load_image("screen0000.png")
    else:
        background(background_img)
        for pixel in pixels_lst:
            pixel.animate(t)
            pixel.draw()
    # global background_pixels
    # print(background_pixels)
    # if millis()/1000 > 2:
    #     if first_render:
    #         first_render = False
    #         for pixel in constant_pixels_lst:
    #             pixel.draw()
    #
    #                   # p5.renderer.flush_geometry()
    #         # with load_pixels():
    #         #     # load_pixels is saving the background color,
    #         #     # but not the constant pixels drawn above
    #         #     background_pixels = pixels
    #         #     pixels.save("bing.png")
    #     else:
    #         background(background_pixels)
    # else:
    #     for pixel in constant_pixels_lst:
    #         pixel.draw()


    # Rendering all black pixels, then all white pixels
    # doesn't seem to improve FPS
    # for pixel in b_pixels:
    #     fill(0)
    #     pixel.animate(t)
    #     pixel.draw()
    #
    # for pixel in w_pixels:
    #     fill(255)
    #     pixel.animate(t)
    #     pixel.draw()

    print(frame_rate)


run()