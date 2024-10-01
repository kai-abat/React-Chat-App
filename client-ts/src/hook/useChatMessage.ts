import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useContext } from "react";
import { ChatV2Context } from "../context/ChatV2Context";
import { getChatMessage, sendTextMessage } from "../services/chatService";
import { ChatModelType } from "../types/MongoDBModelTypes";

const useChatMessage = (chat: ChatModelType | null) => {
  const { messageURI } = useContext(ChatV2Context);
  const queryClient = useQueryClient();

  const {
    data: chatMessages,
    isLoading: isFetchingMessages,
    error,
  } = useQuery({
    queryKey: ["Current_Chat_Messages", chat?._id],
    queryFn: () => getChatMessage(chat?._id, messageURI),
  });

  const { mutate: sendTextMessageMutate } = useMutation({
    mutationFn: sendTextMessage,
    onSuccess: (message) => {
      if (chat) {
        queryClient.invalidateQueries({
          queryKey: ["Current_Chat_Messages", chat._id],
        });
      }
    },
  });

  return { chatMessages, isFetchingMessages, error, sendTextMessageMutate };
};

export default useChatMessage;
