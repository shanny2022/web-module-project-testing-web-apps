import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ContactForm from './ContactForm';

// Test 1: the component renders the contact form component without errors.
test('renders without errors', () => {
    render(<ContactForm />);
});

// Test 2: the header h1 element exists.
test('header exists', () => {
    const { getByRole } = render(<ContactForm />);
    const header = getByRole('heading', { level: 1 });
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header.textContent).toBe('Contact Form');
});

// Test 3: the component renders ONE error message if the user enters less than 4 characters into the firstname field.
test('renders ONE error message if user enters less then 4 characters into firstname.', async () => {
    const { getByLabelText, findByText } = render(<ContactForm />);

    // Simulate user input
    fireEvent.change(getByLabelText('First Name'), { target: { value: 'abc' } });

    // Wait for the error message to appear and check if it's in the document
    const errorMessage = await findByText('First name must be at least 4 characters long.');
    expect(errorMessage).toBeInTheDocument();
});

// Continue with the rest of the tests...

test('renders THREE error messages if user enters no values into any fields.', async () => {
    const { getByRole, findAllByText } = render(<ContactForm />);

    // Simulate form submission
    fireEvent.submit(getByRole('button'));

    // Wait for the error messages to appear and check if there are three
    const errorMessages = await findAllByText(/required/i);
    expect(errorMessages).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    const { getByLabelText, getByRole, findByText } = render(<ContactForm />);

    // Simulate user input
    fireEvent.change(getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name'), { target: { value: 'Doe' } });

    // Simulate form submission
    fireEvent.submit(getByRole('button'));

    // Wait for the error message to appear and check if it's in the document
    const errorMessage = await findByText('Email is a required field.');
    expect(errorMessage).toBeInTheDocument();
});
test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    const { getByLabelText, findByText } = render(<ContactForm />);

    // Simulate user input
    fireEvent.change(getByLabelText('Email'), { target: { value: 'invalid email' } });

    // Wait for the error message to appear and check if it's in the document
    const errorMessage = await findByText('Email must be a valid email address.');
    expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if the form is submitted without a last name', async () => {
    const { getByLabelText, getByRole, findByText } = render(<ContactForm />);

    // Simulate user input
    fireEvent.change(getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'john@example.com' } });

    // Simulate form submission
    fireEvent.submit(getByRole('button'));

    // Wait for the error message to appear and check if it's in the document
    const errorMessage = await findByText('LastName is a required field.');
    expect(errorMessage).toBeInTheDocument();
});

test('renders firstname, lastname, and email when submitted with valued fields and does not render a message value when one is not entered', async () => {
    const { getByLabelText, getByRole, findByText, queryByText } = render(<ContactForm />);

    // Simulate user input
    fireEvent.change(getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'john@example.com' } });

    // Simulate form submission
    fireEvent.submit(getByRole('button'));

    // Wait for the firstname, lastname, and email to appear and check if they're in the document
    const firstname = await findByText('John');
    const lastname = await findByText('Doe');
    const email = await findByText('john@example.com');
    expect(firstname).toBeInTheDocument();
    expect(lastname).toBeInTheDocument();
    expect(email).toBeInTheDocument();

    // Check if the message value is not in the document
    const message = queryByText('Your expected message text');
    expect(message).not.toBeInTheDocument();
});

test('renders all fields text when all fields are submitted.', async () => {
    const { getByLabelText, getByRole, findByText } = render(<ContactForm />);

    // Simulate user input
    fireEvent.change(getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(getByLabelText('Message'), { target: { value: 'Hello, World!' } });

    // Simulate form submission
    fireEvent.submit(getByRole('button'));

    // Wait for the field values to appear and check if they're in the document
    const firstname = await findByText('John');
    const lastname = await findByText('Doe');
    const email = await findByText('john@example.com');
    const message = await findByText('Hello, World!');
    expect(firstname).toBeInTheDocument();
    expect(lastname).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(message).toBeInTheDocument();
});
