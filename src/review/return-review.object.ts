import { Prisma } from '@prisma/client'
import { returnUserObject } from 'src/user/decorators/return-user.object'

export const returnReviewObject: Prisma.ReviewSelect = {
	id: true,
	createdAt: true,
	text: true,
	rating: true,
	user: {
		select: returnUserObject
	},
	movie: {
		//? Make return movie object
		select: {
			id: true
		}
	}
}
