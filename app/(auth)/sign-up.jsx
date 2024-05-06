import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { images } from "../../constants";
import { Link,router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { createUser } from "../../lib/appwrite";

import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {

  const { setUser, setisLoggedIn } = useGlobalContext();
  const [isSubmitting, setisSubmitting] = useState(false);

  const [form, setform] = useState({
    username: "",
    email: "",
    password: "",
  });

  



  const submit = async () => {
    if(form.username === "" || form.email==="" || form.password === "")
    {
      Alert.alert("Error", "Please fill all the fields");
    }

    setisSubmitting(true);

    try {
      const result= await createUser(form.email, form.password, form.username);
      setUser(result);
      setisLoggedIn(true);
      
      //set it to global state..

      router.replace('/home');

    } catch (error) {
      Alert.alert("Error", error.message);
      throw new Error(error);
    } finally {
      setisSubmitting(false);
    }

    createUser();
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[90vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold ">
            Register to Aora
          </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(text) => setform({ ...form, username: text })}
            otherStyles="mt-10"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(text) => setform({ ...form, email: text })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(text) => setform({ ...form, password: text })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Sign in!
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
