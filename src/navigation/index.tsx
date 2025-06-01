import React, { Fragment, useEffect, useState } from 'react'
import { Text } from 'react-native'
import { View } from 'react-native'
import AuthNavigation from './authnavigation'
import StackNavigation from './stacknavigation'
import OnBoardNavigation from './onboard'
import { StorageManager } from '../helpers/localstorage/StorageManager'
import { useAppSelector } from '../hooks/useAppSelector'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { setIsSignIn, setOnBoard } from '../store/reducers/appauth'

const Navigation = () => {
  const dispatch = useAppDispatch();
  const { onBoard = null } = useAppSelector((state) => state.authauth);
  const { isSignIn = null } = useAppSelector((state) => state.authauth);

  useEffect(() => {
    StorageManager.getOnBoard()
      .then((response) => {
        if (response) {
          dispatch(setOnBoard({ onBoard: true }))
        } else {
          dispatch(setOnBoard({ onBoard: false }))
        }
      })
      .catch(() => {
        dispatch(setOnBoard({ onBoard: false }))
      })
  }, [onBoard]);

  useEffect(() => {
    StorageManager.getToken()
      .then((response) => {
        if (typeof response === "string") {
          dispatch(setIsSignIn({ isSignIn: true }))
        } else {
          dispatch(setIsSignIn({ isSignIn: false }))
        }
      })
      .catch(() => {
        dispatch(setIsSignIn({ isSignIn: false }))
      })
  }, [isSignIn]);

  if (onBoard === null) return;
  if (isSignIn === null) return;
  return (
    <Fragment>
      {onBoard ?
        isSignIn ?
          <StackNavigation />
          :
          <AuthNavigation />
        :
        <OnBoardNavigation />
      }
    </Fragment>
  )
}

export default Navigation
