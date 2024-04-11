import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification.jsx'
import LoginForm from './components/LoginForm.jsx'
import BlogForm from './components/BlogForm.jsx'
import Togglable from './components/Togglable.jsx'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState({})

    useEffect(() => {
        async function getBlogs() {
            const allBlogs = await blogService.getAll()
            setBlogs(allBlogs.sort((a, b) => b.likes - a.likes))
        }
        getBlogs()
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleMessage = (message) => {
        setMessage(message)
        setTimeout(() => {
            const newMessage = {
                ...message,
                text: null
            }
            setMessage(newMessage)
        }, 5000)
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password,
            })
            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
            handleMessage({ text: 'user logged in succesfull', type: 'notification' })
        } catch (exception) {
            handleMessage({ text: 'Wrong username or password', type: 'error' })
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        window.location.reload()
    }

    const createBlog = async (blogObject) => {
        try {
            const returnedBlog = await blogService.create(blogObject)
            setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes))
            handleMessage({ text: `a new blog ${blogObject.title} added`, type: 'notification' })
        } catch (error) {
            handleMessage({ text: 'Error creating blog', type: 'error' })
        }
    }

    const increaseLikes = async (blog) => {
        const updatedBlog = { ...blog, likes: blog.likes + 1 }

        try {
            await blogService.update(updatedBlog)
            setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog).sort((a, b) => b.likes - a.likes))
            handleMessage({ text: `blog ${updatedBlog.title} updated`, type: 'notification' })
        } catch (error) {
            handleMessage({ text: 'Error updating blog', type: 'error' })
        }
    }

    const handleDelete = async (blogToDelete) => {
        if(window.confirm(`Remove ${blogToDelete.title} by ${blogToDelete.author}`)) {
            try {
                await blogService.remove(blogToDelete.id)
                setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id).sort((a, b) => b.likes - a.likes))
                handleMessage({ text: `blog ${blogToDelete.title} deleted`, type: 'notification' })
            } catch (error) {
                handleMessage({ text: 'Error deleting blog', type: 'error' })
            }
        }
    }


    if(user === null)
        return (
            <div>
                <h2>Login</h2>
                <Notification text={message.text} type={message.type} />
                <LoginForm
                    username={username}
                    password={password}
                    handleUsernameChange={({ target }) => setUsername(target.value)}
                    handlePasswordChange={({ target }) => setPassword(target.value)}
                    handleSubmit={handleLogin}
                />
            </div>
        )
    return (
        <div>
            <h2>blogs</h2>
            <Notification text={message.text} type={message.type} />
            <div>
                {user.username} logged in
                <button onClick={handleLogout}>logout</button>
            </div>
            <Togglable buttonLabel={'new blog'} >
                <BlogForm createBlog={createBlog} user={user} />
            </Togglable>
            {blogs.map(blog =>
                <Blog key={blog.id}
                    blog={blog}
                    increaseLikes={increaseLikes}
                    currentUser={user}
                    handleDelete={handleDelete}
                />
            )}
        </div>
    )
}

export default App