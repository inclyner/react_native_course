import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { icons } from "../constants";
import { useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import { ResizeMode, Video} from "expo-av";

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator,username, avatar ,
  },
}) => {
  const [play, setplay] = useState(false);

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px]  h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs font-pregular text-gray-100"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {play ? (
        
  <Video
  source={{uri: video}}
  className="w-full h-60 rounded-xl mt-3 "
  resizeMode={ResizeMode.CONTAIN}
  useNativeControls
  shouldPlay
  onPlaybackStatusUpdate={(status) =>{ if(status.didJustFinish) {setPlay(false)}}}
  
  />
      ) : (
        <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => setplay(true)}
        className="w-full h-60 rouded-xl mt-3 relative justify-center items-center">
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rouded-xl mt-3"
            resizeMode="cover"
          />
          <Image 
          source={icons.play}
          className="w-12 h-12 absolute"

          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
