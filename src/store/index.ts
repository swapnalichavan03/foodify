import { configureStore } from '@reduxjs/toolkit'
import tabnavigation from './reducers/tabnavigation'
import authAuth from './reducers/appauth'
import userprofile from './reducers/userprofile'
import createrecipe from './reducers/createrecipe'
import pickerdImage from './reducers/images'
import notificationsound from './reducers/notificationsound'
import recipe from './reducers/recipe'
import recipeReview from './reducers/recipereview'

export const store = configureStore({
    reducer: {
        tabnavigation: tabnavigation,
        authauth: authAuth,
        userprofile: userprofile,
        createrecipe: createrecipe,
        pickeredimages: pickerdImage,
        notificationsound: notificationsound,
        recipe: recipe,
        review: recipeReview,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch