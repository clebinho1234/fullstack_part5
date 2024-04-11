const { test, expect, beforeEach, describe } = require('@playwright/test')
const { postUser, loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http:localhost:3001/api/testing/reset')
        await postUser(request, 'Matti Luukkainen', 'mluukkai', 'salainen')

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByTestId('username')).toBeVisible()
        await expect(page.getByTestId('password')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
            await expect(page.getByText('mluukkai logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'otherUser', 'otherPass')

            const errorDiv = page.locator('.error')
            await expect(errorDiv).toContainText('Wrong username or password')
            await expect(errorDiv).toHaveCSS('border-style', 'solid')
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      
            await expect(page.getByText('mluukkai logged in')).not.toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
        })

        test('the user can logout', async ({ page }) => {
            await page.getByRole('button', { name: 'logout' }).click()
        
            await expect(page.getByTestId('username')).toBeVisible()
            await expect(page.getByTestId('password')).toBeVisible()
        })
  
        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click()
            await createBlog(page, 'a blog created by playwright', 'Playwright Author', 'http://playwrightTest.com/')

            const newBlog = page.locator('.blog')

            await expect(newBlog).toBeVisible()
            await expect(newBlog).toContainText('a blog created by playwright')
        })

        describe('And a blog is already created', () => {
            beforeEach(async ({ page }) => {
                await page.getByRole('button', { name: 'new blog' }).click()
                await createBlog(page, 'a blog created by playwright', 'Playwright Author', 'http://playwrightTest.com/')
            })
    
            test('likes can be increased', async ({ page }) => {
                const newBlog = page.locator('.blog')
    
                await newBlog.getByRole('button', { name: 'view' }).click()
                await expect(newBlog).toContainText('likes 0')

                await newBlog.getByRole('button', { name: 'like' }).click()
                await expect(newBlog).toContainText('likes 1')
            })

            test('the user who creates the blog can delete it', async ({ page }) => {
                const newBlog = page.locator('.blog')
    
                await newBlog.getByRole('button', { name: 'view' }).click()
    
                await expect(newBlog).toContainText('Matti Luukkainen')
    
                page.on('dialog', async dialog=>{
                    expect(dialog.type()).toContain('confirm')
                    expect(dialog.message()).toContain('Remove a blog created by playwright by Playwright Author')
                    await dialog.accept()
                })
                await newBlog.getByRole('button', { name: 'remove' }).click()

                await expect(newBlog).not.toBeVisible()
            })

            describe('And there are two users', () => {
                beforeEach(async ({ page, request }) => {
                    await postUser(request, 'New User', 'newuser', 'newpass')
                    await page.getByRole('button', { name: 'logout' }).click()

                    await loginWith(page, 'newuser', 'newpass')
                })
        
                test('the user can not delete a blog that other user created', async ({ page }) => {
                    const newBlog = page.locator('.blog')
    
                    await newBlog.getByRole('button', { name: 'view' }).click()
    
                    await expect(newBlog).toContainText('Matti Luukkainen')
    
                    await expect(newBlog.getByRole('button', { name: 'remove' })).not.toBeVisible()
                })
            })
        })
        describe('When there are multiple blogs created', () => {
            beforeEach(async ({ page }) => {
                await page.getByRole('button', { name: 'new blog' }).click()

                await createBlog(page, 'a blog created by playwright', 'Playwright Author', 'http://playwrightTest.com/')
                await createBlog(page, 'an example blog', 'example blog', 'http://manyBlogs.com/')
                await createBlog(page, 'a test blog', 'Test Author', 'http://Testexample.com/')
            })

            test('the blogs are arrenged in the order according to the likes', async ({ page }) => {
                const blogTestBlog = page.getByText('a test blog Test Author').locator('..')
    
                await blogTestBlog.getByRole('button', { name: 'view' }).click()
                await blogTestBlog.getByRole('button', { name: 'like' }).click()
                await expect(blogTestBlog).toContainText('likes 1')

                const blogWithMostLikes = page.locator('.blog').first()

                expect(await blogTestBlog.textContent()).toEqual(await blogWithMostLikes.textContent())
            })
        })
    })
})