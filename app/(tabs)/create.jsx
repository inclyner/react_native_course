import { View, Text, Image } from "react-native";
import React from "react";
import FormField from "../../components/FormField";
import { SafeAreaView, ScrollView } from "react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Video, resizeMode } from "expo-av";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";
import { router } from "expo-router";
import { createVideo } from "../../lib/appwrite";


const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === 'image' ? ["image/png", "image/jpeg", "image/jpg"]
        : ["video/mp4", "video/gif"],
    })

    if (!result.canceled) {
      if (selectType === 'image') {
        setForm({ ...form, thumbnail: result.assets[0] });
      }

      if (selectType === 'video') {
        setForm({ ...form, video: result.assets[0] });
      }

    }
  
  }
  

  const submit = async () => {
    if(!form.title || !form.prompt || !form.video || !form.thumbnail)
    {
      Alert.alert("Error", "Please fill all the fields");
    }

    setUploading(true)

    try {

      await createVideo({...form,userId: user.$id});

      Alert.alert("Success", "Video uploaded successfully");
      router.push('/home')
    } catch (error) {
      Alert.alert("Error", error.message);
    }finally{
      setForm({
      title: "",
      video: null,
      thumbnail: null,
      prompt: "",})
      setUploading(false);
    }

   }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Upload Video!
        </Text>
        <FormField
          title="Video title"
          value={form.title}
          placeholder={"give your video a catchy title"}
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rouded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rouded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-1/2 h-1/2"
                />
                <Text className="text-sm test-gray-100 font-pmedium">Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI prompt"
          value={form.prompt}
          placeholder="the prompt you used to generate the video"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="submit & publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default Create;
