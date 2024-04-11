import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'

test('renders title and author but not URL or likes by default', () => {
    const blog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://example.com/test',
        likes: 5
    }

    render(<Blog blog={blog} />)

    expect(screen.getByText('Test Blog Test Author')).toBeTruthy()
    expect(screen.queryByText('http://example.com/test')).toBeNull()
    expect(screen.queryByText('likes 5')).toBeNull()
})

test('shows URL and number of likes when details button is clicked', async () => {
    const blog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://example.com/test',
        likes: 5
    }

    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('http://example.com/test', { exact: false })).toBeTruthy()
    expect(screen.getByText('likes 5', { exact: false })).toBeTruthy()
})

test('calls event handler twice if like button is clicked twice', async () => {
    const blog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://example.com/test',
        likes: 10,
    }
    const increaseLikes = vi.fn()

    render(<Blog blog={blog} increaseLikes={increaseLikes} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(increaseLikes.mock.calls).toHaveLength(2)
})