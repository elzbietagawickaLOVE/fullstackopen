import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'

test('renders content', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    url: 'cycki',
    likes: 69,
    user: '653035fe0f3a3c9c31c0632c',
  }

  const userObject = {
    id: '653035fe0f3a3c9c31c0632c'
  }

  const mockHandler = jest.fn()


  const { container } = render(<Blog blog={blog} user={userObject} blogLike={mockHandler}/>)

  const user = userEvent.setup()

  const button = screen.getByText('like')

  const showMoreButton = screen.getByText('show more')
  
  const likesBefore = screen.queryByText('likes:')
  expect(likesBefore).toBeNull()

  const urlBefore = screen.queryByText('url:')
  expect(urlBefore).toBeNull()

  await user.click(showMoreButton)
  screen.debug()
  const likesAfter = screen.queryByText('likes:')
  expect(likesAfter).not.toBeNull()

  const urlAfter = screen.queryByText('url:')
  expect(urlAfter).not.toBeNull()

  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(1)

  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})