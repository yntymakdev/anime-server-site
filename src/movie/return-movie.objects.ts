import { Prisma } from '@prisma/client'
import { returnActorObject } from 'src/actor/return-actor.obj'
import { returnGenreObject } from 'src/genre/return-genre.obj'
import { returnReviewObject } from 'src/review/return-review.object'

export const returnMovieObject: Prisma.MovieSelect = {
	id: true,
	createdAt: true,
	title: true,
	slug: true,
	poster: true,
	bigPoster: true,
	videoUrl: true,
	views: true,
	country: true,
	year: true,
	duration: true,
	reviews: {
		orderBy: {
			createdAt: 'desc'
		},
		select: returnReviewObject
	},
	actors: {
		select: returnActorObject
	},
	genres: { select: returnGenreObject }
}
