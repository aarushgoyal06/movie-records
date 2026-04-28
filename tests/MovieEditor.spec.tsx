import { fireEvent, render, screen } from "@testing-library/react";
import { MovieEditor } from "../src/components/MovieEditor";
import type { Movie } from "../src/interfaces/movie";

describe("MovieEditor Component", () => {
    const makeMovie = (): Movie => ({
        id: "test-movie-123",
        title: "The Test Movie",
        rating: 7,
        description: "A movie for testing",
        released: 2020,
        soundtrack: [{ id: "song1", name: "Test Song", by: "Test Artist" }],
        watched: {
            seen: true,
            liked: true,
            when: "2023-01-01",
        },
    });

    test("renders initial values from the movie prop", () => {
        const movie = makeMovie();
        render(
            <MovieEditor
                changeEditing={jest.fn()}
                movie={movie}
                editMovie={jest.fn()}
                deleteMovie={jest.fn()}
            />,
        );

        expect(screen.getByDisplayValue("The Test Movie")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2020")).toBeInTheDocument();
        expect(screen.getByDisplayValue("A movie for testing")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toHaveValue("8");
    });

    test("saves edited fields and exits editing", () => {
        const movie = makeMovie();
        const changeEditing = jest.fn();
        const editMovie = jest.fn();
        render(
            <MovieEditor
                changeEditing={changeEditing}
                movie={movie}
                editMovie={editMovie}
                deleteMovie={jest.fn()}
            />,
        );

        fireEvent.change(screen.getByDisplayValue("The Test Movie"), {
            target: { value: "New Title" },
        });
        fireEvent.change(screen.getByDisplayValue("2020"), {
            target: { value: "1999" },
        });
        fireEvent.change(screen.getByDisplayValue("A movie for testing"), {
            target: { value: "Updated description" },
        });
        fireEvent.change(screen.getByRole("combobox"), {
            target: { value: "10" },
        });
        fireEvent.change(screen.getByDisplayValue("Test Song"), {
            target: { value: "New Song Name" },
        });
        fireEvent.change(screen.getByDisplayValue("Test Artist"), {
            target: { value: "New Artist" },
        });

        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(editMovie).toHaveBeenCalledWith("test-movie-123", {
            ...movie,
            title: "New Title",
            released: 1999,
            rating: 10,
            description: "Updated description",
            soundtrack: [
                { id: "song1", name: "New Song Name", by: "New Artist" },
            ],
        });
        expect(changeEditing).toHaveBeenCalledTimes(1);
    });

    test("coerces invalid numeric values to 0 on save", () => {
        const movie = makeMovie();
        const editMovie = jest.fn();
        render(
            <MovieEditor
                changeEditing={jest.fn()}
                movie={movie}
                editMovie={editMovie}
                deleteMovie={jest.fn()}
            />,
        );

        fireEvent.change(screen.getByDisplayValue("2020"), {
            target: { value: "" },
        });
        fireEvent.change(screen.getByRole("combobox"), {
            target: { value: "" },
        });
        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(editMovie).toHaveBeenCalledWith(
            "test-movie-123",
            expect.objectContaining({
                released: 0,
                rating: 0,
            }),
        );
    });

    test("cancel exits editing without saving", () => {
        const changeEditing = jest.fn();
        const editMovie = jest.fn();
        render(
            <MovieEditor
                changeEditing={changeEditing}
                movie={makeMovie()}
                editMovie={editMovie}
                deleteMovie={jest.fn()}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

        expect(changeEditing).toHaveBeenCalledTimes(1);
        expect(editMovie).not.toHaveBeenCalled();
    });

    test("delete calls deleteMovie with the current movie id", () => {
        const deleteMovie = jest.fn();
        render(
            <MovieEditor
                changeEditing={jest.fn()}
                movie={makeMovie()}
                editMovie={jest.fn()}
                deleteMovie={deleteMovie}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: /delete/i }));

        expect(deleteMovie).toHaveBeenCalledWith("test-movie-123");
    });
});
