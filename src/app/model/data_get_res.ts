export interface UserPostRequest {
  userID: number;
  username: string;
  email: string;
  password: string;
  avatar: string;
  position: number;
}

export interface ImagePostRequest {
  imageID: number;
  userID: number;
  imageURL: string;
  uploadDate: Date;
  voteCount: number;
  imageName: string;
}

export interface Top10Data {
  image: ImagePostRequest[];
  user: UserPostRequest[];
}

export interface VotePostRequest {
  voteID: number;
  imageID: number;
  voteDate: Date;
  voteScore: number;
}
