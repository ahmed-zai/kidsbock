// client/__tests__/components/BookCard.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import BookCard from '../../src/components/BookCard';

describe('BookCard', () => {
  const mockBook = {
    id: '1',
    title: 'The Great Adventure',
    description: 'A thrilling story for young readers.',
    cover_image_url: 'http://example.com/cover.jpg',
  };

  it('renders book details correctly', () => {
    render(
      <BookCard book={mockBook} />
    );

    // Assert that title and description are rendered
    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(screen.getByText(mockBook.description)).toBeInTheDocument();

    // Assert that the cover image is rendered
    const coverImage = screen.getByAltText(mockBook.title);
    expect(coverImage).toBeInTheDocument();
    expect(coverImage).toHaveAttribute('src', mockBook.cover_image_url);
  });
});
