
from openai import OpenAI
from environs import Env

# Load the environment variables
env = Env()
env.read_env()

client = OpenAI()
client.api_key=env.str("OPENAI_API_KEY")

class AiChat():

    _channels = {}  # In-Memory Channel Layer

    def __init__(self, prompt: str, model: str, channel: str) -> None:
        self.prompt = prompt
        self.model = model
        self.channel = channel

        ## In-Memory Channel Layer
        if self.channel not in AiChat._channels:
            AiChat._channels[self.channel] = [
                {"role": "user", "content": "You are helpful and friendly assistant. Be short but concise as you can!"},
            ]
        self.conversation = AiChat._channels[self.channel]

    def chat(self) -> str:
        if self.prompt:
            # The conversation is going on ...
            # Adding prompt to chat history
            self.conversation.append({"role": "user", "content": self.prompt})
            # The OpenAI's chat completion generates answers to your prompts.
            completion = client.chat.completions.create(
                model=self.model,
                messages=self.conversation
            )
            answer = completion.choices[0].message.content
            # Adding answer to chat history
            self.conversation.append({"role": "assistant", "content": answer})
            return answer