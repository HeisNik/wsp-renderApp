const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Album = require('../models/album')
const testAlbums = require('./testAlbums')
const {equal} = require('supertest')

const api = supertest(app)

beforeEach(async () => {
    await Album.deleteMany({})
    await Album.create(testAlbums)
  })
  

test('albums are returned as json and response and albums in database lenght are equal', async () => {
  const response = await api
    .get('/api/albums')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    expect(response.body.albums).toHaveLength(testAlbums.length)
})

test('a new album can be added ', async () => {
  const newAlbum = {
    title: "Hard rock hallelujah",
    artist: "Lordi",
    tracks: 15,
    year: 2006,
    genre: "Rock"
  }

await api
    .post('/api/albums')
    .send(newAlbum)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  

  const response = await api.get('/api/albums')
  expect(response.body.albums).toHaveLength(testAlbums.length + 1)
  expect(response.body.albums[3].title).toEqual(newAlbum.title)
  expect(response.body.albums[3].artist).toEqual(newAlbum.artist)
})

test('album can be deleted succesfully ', async () => {
  const albums = await api.get('/api/albums')
  const deleteAlbum = albums.body.albums[0]
  const id = deleteAlbum._id

  await api
  .delete(`/api/albums/${id}`)
  .expect(204)

  const response = await api.get('/api/albums')

  expect(response.body.albums).toHaveLength(testAlbums.length - 1)

  expect(response.body.albums[0].title).not.toBe(deleteAlbum.title)
  expect(response.body.albums[1].title).not.toBe(deleteAlbum.title)
})

test('API handles delete attempt gracefully if there is not album with this id', async () => {
  
  const response = await api
  .delete(`/api/albums/11111111f1111d11e11a1a1b`)
  .expect(404)
  expect(response.body.msg).toEqual('Album not found with id 11111111f1111d11e11a1a1b')
})
afterAll(() => {
  mongoose.connection.close()
})