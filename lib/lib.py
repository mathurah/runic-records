import random
import numpy as np
import pandas as pd
from PIL import Image

# Start with monochromatic pixel art images as input
tileset_name = "vectorpixelstar-1-bit-icons"
img_1 = f"img/tilesets/{tileset_name}/tile_3.png"
img_2 = f"img/tilesets/{tileset_name}/tile_6.png"


def flatten(lst):
    return [item for sublist in lst for item in sublist]


def load_img_to_df(img_path):
    # Load pixels from image into to dataframe
    im = Image.open(img_path)
    array = np.array(im)
    return pd.DataFrame(array).astype("int16")


def clamp_df_to_binary(df):
    return (
        df
        .where(df >= 128, 0)
        .where(df < 128, 1)
    )


def get_pixel_diff_lists(diff: pd.DataFrame):
    # List of pixels that go from white to black (1)
    coords_of_wb = flatten([
        [(col, y) for y in diff[col][diff[col] == 1].index.tolist()]
        for col in diff.columns
    ])

    # List of pixels that go from white to black (-1)
    coords_of_bw = flatten([
        [(col, y) for y in diff[col][diff[col] == -1].index.tolist()]
        for col in diff.columns
    ])

    return coords_of_wb, coords_of_bw


def get_coords_of_constant(df, diff):
    # List of constant white pixels
    coords_of_constant_w = flatten([
        [(col, y) for y in diff[col][
            (diff[col] == 0) &
            (df[col] == 1)
            ].index.tolist()]
        for col in diff.columns
    ])

    # List of constant black pixels
    coords_of_constant_b = flatten([
        [(col, y) for y in diff[col][
            (diff[col] == 0) &
            (df[col] == 0)
            ].index.tolist()]
        for col in diff.columns
    ])

    return coords_of_constant_w, coords_of_constant_b


def get_excess_pixels(coords_of_wb, coords_of_bw, diff):
    # Create list of "excess pixels" that need to be moved to the border / off the canvas
    excess_pixels_list = coords_of_wb if len(coords_of_wb) > len(coords_of_bw) else coords_of_bw
    num_excess_pixels = diff.sum().sum()

    assert len(coords_of_wb) != len(coords_of_bw)
    assert abs(len(coords_of_wb) - len(coords_of_bw)) == num_excess_pixels

    coords_of_excess_pixels = [
        excess_pixels_list.pop(random.randrange(0, len(excess_pixels_list)))
        for _ in range(num_excess_pixels)
    ]

    assert len(coords_of_wb) == len(coords_of_bw)

    return coords_of_excess_pixels, coords_of_wb, coords_of_bw


def main():
    df1 = clamp_df_to_binary(load_img_to_df(img_1))
    df2 = clamp_df_to_binary(load_img_to_df(img_2))

    diff = df1 - df2
    # Meaning of diff values
    # Non-zero means that pixel value needs to swap
    # Zero means that pixel value should remain constant
    # Sum of diff is number of excess pixel values
    """
     1, w1 b2
     0, w1 w2 or b1 b2
    -1, b1 w2
    """

    coords_of_wb, coords_of_bw = get_pixel_diff_lists(diff)
    coords_of_constant_w, coords_of_constant_b = get_coords_of_constant(df1, diff)

    coords_of_excess_pixels, coords_of_wb, coords_of_bw = get_excess_pixels(coords_of_wb, coords_of_bw, diff)

    # Randomly pair pixels to be exchanged
    pixel_pairs = list(zip(
        random.sample(coords_of_wb, len(coords_of_wb)),
        random.sample(coords_of_bw, len(coords_of_bw)))
    )

    print(len(coords_of_wb))
    print(len(coords_of_bw))
    print(len(coords_of_constant_w))
    print(len(coords_of_constant_b))
    print(len(coords_of_excess_pixels))
    print(len(pixel_pairs))


if __name__ == "__main__":
    main()
