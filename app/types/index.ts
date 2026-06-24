export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  category: string;
  description: string;
  headerImage: string;
  createdBy: string;
  deadline: string;
  totalVotes: number;
  options: PollOption[];
  voters: string[];
  isActive?: boolean;
  isClosed?: boolean;
  showResults?: boolean;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface AuthForm {
  name: string;
  email: string;
}