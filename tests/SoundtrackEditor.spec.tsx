import { fireEvent, render, screen } from "@testing-library/react";
import {
    SongByEditor,
    SongNameEditor,
    SoundtrackEditor,
} from "../src/components/SoundtrackEditor";
import type { Song } from "../src/interfaces/song";

describe("SongNameEditor", () => {
    test("updates song name while preserving other fields", () => {
        const setSong = jest.fn();
        const song: Song = { id: "id-1", name: "Old Name", by: "Artist" };
        render(<SongNameEditor song={song} setSong={setSong} />);

        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "New Name" },
        });

        expect(setSong).toHaveBeenCalledWith("id-1", {
            id: "id-1",
            name: "New Name",
            by: "Artist",
        });
    });
});

describe("SongByEditor", () => {
    test("updates song artist while preserving other fields", () => {
        const setSong = jest.fn();
        const song: Song = { id: "id-2", name: "Track", by: "Old Artist" };
        render(<SongByEditor song={song} setSong={setSong} />);

        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "New Artist" },
        });

        expect(setSong).toHaveBeenCalledWith("id-2", {
            id: "id-2",
            name: "Track",
            by: "New Artist",
        });
    });
});

describe("SoundtrackEditor", () => {
    test("updates matching song by id from the name input", () => {
        const setSongs = jest.fn();
        const songs: Song[] = [
            { id: "s1", name: "First", by: "A" },
            { id: "s2", name: "Second", by: "B" },
        ];
        render(<SoundtrackEditor songs={songs} setSongs={setSongs} />);

        const inputs = screen.getAllByRole("textbox");
        fireEvent.change(inputs[0], { target: { value: "First Updated" } });

        expect(setSongs).toHaveBeenCalledWith([
            { id: "s1", name: "First Updated", by: "A" },
            { id: "s2", name: "Second", by: "B" },
        ]);
    });

    test("updates matching song by id from the artist input", () => {
        const setSongs = jest.fn();
        const songs: Song[] = [{ id: "s1", name: "First", by: "A" }];
        render(<SoundtrackEditor songs={songs} setSongs={setSongs} />);

        const inputs = screen.getAllByRole("textbox");
        fireEvent.change(inputs[1], { target: { value: "Updated Artist" } });

        expect(setSongs).toHaveBeenCalledWith([
            { id: "s1", name: "First", by: "Updated Artist" },
        ]);
    });
});
