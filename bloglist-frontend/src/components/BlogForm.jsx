import  { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleTitle = (event) => {
        setTitle(event.target.value)
    }

    const handleAuthor= (event) => {
        setAuthor(event.target.value)
    }

    const handleUrl = (event) => {
        setUrl(event.target.value)
    }

    const newBlog = (event) => {
        event.preventDefault()

        createBlog({
            title: title,
            author: author,
            url: url
        })

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>create new</h2>
            <div>
                <form onSubmit={newBlog}>
                    <div>
                        title:
                        <input
                            data-testid='title'
                            type="text"
                            value={title}
                            onChange={handleTitle}
                            placeholder='write title here'
                        />
                    </div>
                    <div>
                        author:
                        <input
                            data-testid='author'
                            type="text"
                            value={author}
                            onChange={handleAuthor}
                            placeholder='write author here'
                        />
                    </div>
                    <div>
                        url:
                        <input
                            data-testid='url'
                            type="text"
                            value={url}
                            onChange={handleUrl}
                            placeholder='write url here'
                        />
                    </div>
                    <button type='submit'>create</button>
                </form>
            </div>
        </div>
    )
}

export default BlogForm