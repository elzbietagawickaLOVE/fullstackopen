const e = require("cors")
const _ = require("lodash")

const reverse = (string) => {
    return string
      .split('')
      .reverse()
      .join('')
  }
  
  const average = array => {
    const reducer = (sum, item) => {
      return sum + item
    }
  
    return array.length === 0
      ? 0
      : array.reduce(reducer, 0) / array.length
  }

  const totalLikes = array => {
    var sum = 0

    array.forEach(element => {
      sum += element.likes
    })
    
    return sum
  }

  const favoriteBlog = array => {
    let favoriteObj = array[0]
    array.forEach(element => {
      if(favoriteObj.likes < element.likes)
        favoriteObj = element
    })

    return favoriteObj
  }

  const mostBlogs = array => {
    const authorBlogCounts = _.map(_.values(_.groupBy(array, 'author')), authorBlogs => ({
      author: authorBlogs[0].author,
      blogs: authorBlogs.length,
    }));

    const authorWithMostBlogs = _.maxBy(authorBlogCounts, 'blogs');

    return authorWithMostBlogs    
  }
  
  const mostLikes = array => {
    const authorLikesSum = _.map(_.values(_.groupBy(array, 'author')), authorBlogs => ({
      author: authorBlogs[0].author,
      likes: _.sumBy(authorBlogs, 'likes')
    }))

    const authorWithMostLikes = _.maxBy(authorLikesSum, 'likes')

    return authorWithMostLikes
  }

  module.exports = {
    reverse,
    average,
    totalLikes, 
    favoriteBlog
  }