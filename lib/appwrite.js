import { Avatars, Client } from 'react-native-appwrite';
import { Account, ID,Databases , Query, Storage} from 'react-native-appwrite';


export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.jsm.aora",
    projectId: "6626493ab008226d3717",
    databaseId: "66264a567a69b6b5a982",
    userCollectionId: "66264a7e0c377bbe4afc",
    videoCollectionId: "66264a9e86479b21a2cd",
    storageId: "66264b99094ab2c33669"
}

const{
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
} = appwriteConfig;



// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
    ;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password, 
            username
            )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)
        await signin(email,password)

        const newUser = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, ID.unique(),{
            accountId: newAccount.$id,
            email: email,
            username : username,
            avatar: avatarUrl
        });

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }


}

export const signin = async (email,password)=> {
    try {
        const session =await account.createEmailSession(email, password);

        return session;
    } catch (error) {
    console.log(error);

        throw new Error(error);
    }

}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userCollectionId, [Query.equal('accountId',currentAccount.$id)]);
    
        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const getAllPosts = async () => {
try {
    const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.orderDesc('$createdAt')]
    )

    return posts.documents;
} catch (error) {
    throw new Error(error)
    
}
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
    
        return posts.documents;
    } catch (error) {
        throw new Error(error)
        
    }
}

export const searchPosts = async (query) => {
        try {
            const posts = await databases.listDocuments(
                databaseId,
                videoCollectionId,
                [Query.search('title', query)]
            )
        
            return posts.documents;
        } catch (error) {
            throw new Error(error)
            
        }
}

export const getUserPosts = async (query) => {
        try {
            const posts = await databases.listDocuments(
                databaseId,
                videoCollectionId,
                [Query.equal("Creator", accountId)]
            )
        
            return posts.documents;
        } catch (error) {
            throw new Error(error)
            
        }
}

export const signOut = async () => {
    try {
        const session= await account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error)
    }
}


export const getFilePreview = async (fileId, type) => {
    let fileUrl

    try {
        if(type === 'video'){
            fileUrl = storage.getFilePreview(storageId, fileId);
        }
        else if(type === 'image'){
            fileUrl = storage.getFilePreview(storageId, fileId,2000,2000,"top",100);
        }
        else {
            throw new Error('Invalid file type')
        }

        if(!fileUrl) throw Error;
        return fileUrl;
    } catch (error) {
        throw new Error(error)
    }
}

export const uploadFile = async (file, type) => {
    if(!file) return;

    const {mimeType, ...rest}=file;
    const asset = {
        name:file.fileName,
        type:file.mimeType,
        size:file.fileSize,
        uri:file.uri
    };

    try {
        const uploadedFile = await storage.createFile(storageId, ID.unique(), asset);

        const fileUrl = await storage.getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error)
    }
}


export const createVideo = async (form) => {
    try {
        const [thumbnailURL, videoURL] = await Promise.all([
            uploadFile(form.thumbnail,"image"),
            uploadFile(form.video,"video")
            
        ])

        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailURL,
                video: videoURL,
                prompt: form.prompt,
                creator: form.userId
            }
        )


        return newPost;
    } catch (error) {
        throw new Error(error)
    }
}