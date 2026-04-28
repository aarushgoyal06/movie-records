import { render, screen, fireEvent} from "@testing-library/react";
import App from "../src/App";
import { MovieList } from "../src/components/MovieList";

describe("App Component", () => {
    test("renders the course name somewhere", () => {
        render(<App />);
        const linkElement = screen.getByText(/Movie Records/i);
        expect(linkElement).toBeInTheDocument();
    });

    test("marks a movie as watched", () => {
        render(<App />);
        const watchedButton = screen.getAllByText(/Mark as watched/i);
        expect(watchedButton.length).toBeGreaterThan(0);
        fireEvent.click(watchedButton[0]);
    });

    test("marks a movie as not liked", () => {
        render(<App />);
        const watchedButton = screen.getAllByText(/Mark as watched/i);
        fireEvent.click(watchedButton[0]);
        const notLikedButton = screen.getAllByText(/Not liked/i);
        expect(notLikedButton.length).toBeGreaterThan(0);
        fireEvent.click(notLikedButton[0]);
        const LikedButton = screen.getAllByText(/Liked/i);
        expect(LikedButton.length).toBeGreaterThan(0);
        fireEvent.click(LikedButton[0]);
        expect(LikedButton[0]).toHaveTextContent(/Not liked/i);
    });

    test("edits a movie", () => {
        render(<App />);
        const editButton = screen.getAllByText(/Edit/i);
        fireEvent.click(editButton[0]);
        const titleInput = screen.getByLabelText(/Title/i);
        fireEvent.change(titleInput, { target: { value: "New Title" } });
        const saveButton = screen.getAllByText(/Save/i);
        fireEvent.click(saveButton[0]);
        expect(titleInput).toHaveValue("New Title");
    });
    test("deletes a movie", () => {
        render(<App />);
        fireEvent.click(screen.getAllByRole("button", { name: /edit/i })[0]);
        const deleteButton = screen.getByRole("button", { name: /delete/i });
        fireEvent.click(deleteButton)
        expect(
            screen.queryByText(/kiki's delivery service/i),
        ).not.toBeInTheDocument();
    });
    test("adds a movie", () => {
        render(<App />);
        const before = screen.getAllByText(/mark as watched/i).length;
        fireEvent.click(screen.getByRole("button", { name: /add new movie/i }));
        fireEvent.change(screen.getByLabelText(/youtube id/i), {
            target: { value: "New Title" },
        });
        fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
        const after = screen.getAllByText(/mark as watched/i).length;
        expect(after).toBe(before + 1);
    });
});