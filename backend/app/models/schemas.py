from pydantic import BaseModel


class InputAnalyze(BaseModel):
    keyword: str