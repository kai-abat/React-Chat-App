import { useContext } from "react";
import { getChatLatestMessage } from "../services/chatService";
import { ChatModelType } from "../types/MongoDBModelTypes";
import { ChatV2Context } from "../context/ChatV2Context";
import { useQuery } from "@tanstack/react-query";

export const useFetchLatestMessage = (chat: ChatModelType) => {
  const { messageURI } = useContext(ChatV2Context);
  // const { newMessage, notifications } = useContext(ChatContext);
  // const [latestMessage, setLatestMessage] = useState<MessageInfoType | null>(
  //   null
  // );
  // useEffect(() => {
  //   const getMessage = async () => {
  //     const response = await getAllMessageOfCurrentChatRequest(
  //       `${baseUrl}/messages/${chat._id}`
  //     );
  //     if (response.success) {
  //       const length = response.success.messages.length;
  //       const lastMessage = response.success.messages[length - 1];
  //       setLatestMessage(lastMessage);
  //     }
  //   };
  //   getMessage();
  // }, [newMessage, notifications, chat]);
  // return { latestMessage };

  const { data: latestMessage, isLoadingError: isFetchingNewMsg } = useQuery({
    queryKey: ["LatestMessage", chat._id],
    queryFn: () => getChatLatestMessage(chat._id, messageURI),
  });

  return { latestMessage, isFetchingNewMsg };
};
