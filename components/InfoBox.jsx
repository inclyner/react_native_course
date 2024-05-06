import { View, Text } from 'react-native'
import React from 'react'

const InfoBox = ({ title,subtitle,containerStyle, titleStyles}) => {
  return (
    <View className={containerStyle}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>{title}"(titulo)"</Text>
      <Text className="text-white text-gray-100 text-center font-pregular">{subtitle}"(subtitule)"</Text>
    </View>
  )
}

export default InfoBox