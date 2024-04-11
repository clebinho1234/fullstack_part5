import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { vi } from 'vitest'

test('calls event handler with correct details when new blog is created', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('write title here')
    const authorInput = screen.getByPlaceholderText('write author here')
    const urlInput = screen.getByPlaceholderText('write url here')
    const createButton = screen.getByText('create')

    await user.type(titleInput, 'New Test Blog')
    await user.type(authorInput, 'New Test Author')
    await user.type(urlInput, 'http://example.com/new')
    await user.click(createButton)

    console.log(` content of mock ${createBlog.mock.calls.content}`)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('New Test Blog')
    expect(createBlog.mock.calls[0][0].author).toBe('New Test Author')
    expect(createBlog.mock.calls[0][0].url).toBe('http://example.com/new')
})