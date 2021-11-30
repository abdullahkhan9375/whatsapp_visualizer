import json
from os import error
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import pandas as pd

from stop_words import ROMAN_URDU_STOP_WORDS, MEDIA_STOP_WORDS


class Whatsapp:
    def __init__(self, path, stp_word_exceptions=None):
        self.path = path
        self.df = []
        self.ref_df = []
        self.senders = []
        self.exceptions = stp_word_exceptions

    def ref_helper(self, li):
        ref_li = []
        whatsapp_stopwords = stopwords.words("english") + MEDIA_STOP_WORDS
        if self.stp_word_exceptions is None:
            for word in li:
                if word not in whatsapp_stopwords:
                    ref_li.append(word)
                else:
                    ref_li.append('')
            return ref_li

        elif self.stp_word_exceptions == "URDU":
            stp_words = whatsapp_stopwords + ROMAN_URDU_STOP_WORDS
            for word in li:
                if word not in stp_words:
                    ref_li.append(word)
                else:
                    ref_li.append("")
            return ref_li
        else:
            return ValueError("Stop Word exceptions are only available for Roman Urdu/Hindi.")

    def parse_file(self):
        '''Convert WhatsApp chat log text file to a Pandas dataframe.'''

        # some regex to account for messages taking up multiple lines
        pat = re.compile(
            r'^(\d+\/\d+\/\d\d.*?)(?=^^\d+\/\d+\/\d\d\,\*?)', re.S | re.M)
        with open(self.path, encoding='utf8') as raw:
            data = [m.group(1).strip().replace('\n', ' ')
                    for m in pat.finditer(raw.read())]

        sender = []
        message = []
        refined_message = []
        datetime = []
        wordsTyped = []
        for row in data:

            # timestamp is before the first dash
            datetime.append(row.split(' - ')[0])

            # sender is between am/pm, dash and colon
            try:
                s = re.search('M - (.*?):', row).group(1)
                sender.append(s)
            except:
                sender.append('')

            # message content is after the first colon
            try:
                message.append(row.split(': ', 1)[1])
                wordsTyped.append(len(word_tokenize(row.split(': ', 1)[1])))
                # refined_message.append(self.ref_helper(row.split(': ', 1)[1]))
            except:
                message.append('')
                wordsTyped.append(0)

        df = pd.DataFrame(zip(datetime, sender, message, wordsTyped), columns=[
            'timestamp', 'sender', 'message', "words typed"])
        df['timestamp'] = pd.to_datetime(
            df.timestamp, format='%m/%d/%y, %I:%M %p')

        # remove events not associated with a sender
        df = df[df.sender != ''].reset_index(drop=True)

        self.df = df
        self.senders = self.get_senders()
        # return df

    def get_senders(self):
        '''Return a list of unique senders.'''
        return [x for x in self.df["sender"].unique() if len(x.split(' ')) < 5]

    def get_messages_by_sender(self, sender):
        '''Return a list of messages sent by a sender.'''
        return self.df[self.df["sender"] == sender]["message"].tolist()

    def get_message_count_by_sender(self, sender):
        '''Return the number of messages sent by a sender.'''
        return len(self.df[self.df["sender"] == sender])

    def get_lexical_diversity_by_sender(self, sender):
        """ return lexical diversity of each sender """
        messages = self.get_messages_by_sender(sender)
        return len(set(messages)) / len(messages)

    def get_avg_text_length(self, sender):
        """ return average words per text for each sender """
        messages = self.get_messages_by_sender(sender)
        return sum(len(word_tokenize(x)) for x in messages) / len(messages)

    def get_word_cloud(self, sender):
        messages = self.get_messages_by_sender(sender)
        return self.ref_helper(word_tokenize(" ".join(messages)))

    def group_by_date(self, sender):
        times = pd.to_datetime(
            self.df[self.df["sender"] == sender]["timestamp"])
        times_df = times.groupby(times.dt.date).count()
        time_dict = {x.strftime("%d/%m/%y"): y for x,
                     y in times_df.to_dict().items()}
        return time_dict

    def group_by_hour(self, sender):
        times = pd.to_datetime(
            self.df[self.df["sender"] == sender]["timestamp"])
        return times.groupby(times.dt.hour).count().to_list()

    def group_by_day(self, sender):
        times = pd.to_datetime(
            self.df[self.df["sender"] == sender]["timestamp"])
        return times.groupby(times.dt.day).count().to_dict()

    def send_piechart_json(self):
        """ Returns a sender:count dictionary """
        return json.dumps([{"name": x, "value": self.get_message_count_by_sender(x)} for x in self.senders])

    def send_timeseries_json(self):
        """ returns a sender:timestamp:count dict"""
        return json.dumps([{"name": x, "data": [{"date": k, "count": v} for k, v in self.group_by_date(x).items()]} for x in self.senders])

    def send_lexical_diversity_json(self):
        return json.dumps([{"name": x, "value": self.get_lexical_diversity_by_sender(x)} for x in self.senders])

    def send_avg_text_length_json(self):
        return json.dumps([{"name": x, "value": self.get_avg_text_length(x)} for x in self.senders])

    def send_word_cloud_json(self):
        return json.dumps([{"name": x, "value": self.get_word_cloud(x)}for x in self.senders])

    def send_hourly_json(self):
        return json.dumps([{"name": x, "value": self.group_by_hour(x)} for x in self.senders])

    def send_daily_json(self):
        return json.dumps([{"name": x, "data": [{'date': k, "count": v} for k, v in self.group_by_day(x).items()]} for x in self.senders])


# mes = Whatsapp('data/messages.txt')
# mes.parse_file()
# df = mes.df
# print(mes.send_daily_json())
