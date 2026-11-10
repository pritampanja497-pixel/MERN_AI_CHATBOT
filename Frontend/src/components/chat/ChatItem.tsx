import { Box, Avatar, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function extractCodeFromString(message: string) {
  if (message.includes("```")) {
    return message.split("```");
  }
  return null;
}

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const messageBlocks = extractCodeFromString(content);
  const auth = useAuth();

  return role === "assistant" ? (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: "#004d5612",
        gap: 2,
        borderRadius: 2,
        my: 1,
      }}
    >
      <Avatar sx={{ ml: "0", bgcolor: "transparent" }}>
        <img src="/openai.png" alt="openai" width={"30px"} />
      </Avatar>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        {!messageBlocks && (
          <Typography sx={{ fontSize: "18px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {content}
          </Typography>
        )}
        {messageBlocks &&
          messageBlocks.map((block, index) => {
            const isCode = index % 2 === 1;
            if (isCode) {
              const firstLineEnd = block.indexOf("\n");
              let language = "javascript";
              let code = block;
              if (firstLineEnd !== -1) {
                const possibleLang = block.slice(0, firstLineEnd).trim();
                if (possibleLang && !possibleLang.includes(" ")) {
                  language = possibleLang;
                  code = block.slice(firstLineEnd + 1);
                }
              }
              return (
                <SyntaxHighlighter
                  key={index}
                  style={coldarkDark}
                  language={language}
                >
                  {code.trim()}
                </SyntaxHighlighter>
              );
            }
            if (!block.trim()) return null;
            return (
              <Typography
                key={index}
                sx={{ fontSize: "18px", my: 1, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {block}
              </Typography>
            );
          })}
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: "#004d56",
        gap: 2,
        borderRadius: 2,
        my: 1,
      }}
    >
      <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
        {auth?.user?.name?.[0] || "U"}
        {auth?.user?.name?.split(" ")[1]?.[0] || ""}
      </Avatar>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Typography sx={{ fontSize: "18px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {content}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatItem;
