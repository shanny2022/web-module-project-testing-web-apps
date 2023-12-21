import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    render(<ContactForm />);
    const header = screen.getByRole('heading', { level: 1 });
    expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    userEvent.type(screen.getByLabelText(/first name/i), 'abc');
    userEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/first name must be at least 5 characters/i)).toBeInTheDocument();
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
        expect(screen.getAllByText(/required/i)).toHaveLength(3);
    });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    userEvent.type(screen.getByLabelText(/first name/i), 'John');
    userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    userEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/email is a required field/i)).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    userEvent.type(screen.getByLabelText(/email/i), 'invalid email');
    userEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/email must be a valid email address/i)).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    userEvent.type(screen.getByLabelText(/first name/i), 'John');
    userEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/lastName is a required field/i)).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);
    userEvent.type(screen.getByLabelText(/first name/i), 'John');
    userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    userEvent.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
    userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
        expect(screen.getByText(/John/)).toBeInTheDocument();
        expect(screen.getByText(/Doe/)).toBeInTheDocument();
        expect(screen.getByText(/john.doe@example.com/)).toBeInTheDocument();
        expect(screen.queryByText(/message/i)).not.toBeInTheDocument();
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);
    userEvent.type(screen.getByLabelText(/first name/i), 'John');
    userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    userEvent.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
    userEvent.type(screen.getByLabelText(/message/i), 'Hello, world!');
    userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
        expect(screen.getByText(/John/)).toBeInTheDocument();
        expect(screen.getByText(/Doe/)).toBeInTheDocument();
        expect(screen.getByText(/john.doe@example.com/)).toBeInTheDocument();
        expect(screen.getByText(/Hello, world!/)).toBeInTheDocument();
    });
});
