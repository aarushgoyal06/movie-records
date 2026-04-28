import { fireEvent, render, screen } from "@testing-library/react";
import { EditableSongList } from "../src/components/EditableSongList";

describe("EditableSongList", () => {
    test("adds an empty song when clicking Add Song", () => {
        const setSongs = jest.fn();
        render(<EditableSongList songs={["s1", "s2"]} setSongs={setSongs} />);

        fireEvent.click(screen.getByRole("button", { name: /add song/i }));

        expect(setSongs).toHaveBeenCalledWith(["s1", "s2", ""]);
    });

    test("edits the selected song when typing in an input", () => {
        const setSongs = jest.fn();
        render(<EditableSongList songs={["old", "keep"]} setSongs={setSongs} />);

        const songInputs = screen.getAllByRole("textbox");
        fireEvent.change(songInputs[0], { target: { value: "new" } });

        expect(setSongs).toHaveBeenCalledWith(["new", "keep"]);
    });

    test("deletes the selected song when clicking the delete button", () => {
        const setSongs = jest.fn();
        render(<EditableSongList songs={["first", "second"]} setSongs={setSongs} />);

        const deleteButtons = screen.getAllByRole("button", { name: "❌" });
        fireEvent.click(deleteButtons[1]);

        expect(setSongs).toHaveBeenCalledWith(["first"]);
    });
});
