import { describe, expect, it } from 'vitest';
import { mustContainMatch, mustNotContainMatch } from '@/utils/format';

describe('title match', () => {
  it('wildcard mustContainMatch and', () => {
    const charList = ['【', '】', '★', '！', '[', ']', '喵萌', '新番', '简日'];
    const rule = charList.join(' ');

    const title1 =
      '【喵萌奶茶屋】★04月新番★[竞轮少女！/ Rinkai!][10][1080p][简日双语][招募翻译时轴]';
    const title2 =
      '[喵萌奶茶屋&LoliHouse] 竞轮少女！/ Rinkai! - 03 [WebRip 1080p HEVC-10bit AAC][简繁日内封字幕]';

    expect(mustContainMatch(false, rule, title1)).toBe(true);
    expect(mustContainMatch(false, rule, title2)).toBe(false);
  });
  it('wildcard mustContainMatch or', () => {
    const charList = ['ANi', 'LoliHouse', 'Lilith-Raws'];
    const rule = charList.join('|');

    const title1 =
      '[LoliHouse] 死神少爷与黑女仆 / Shinigami Bocchan to Kuro Maid [25-36 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]';
    const title2 =
      '[ANi] 死神少爷与黑女仆 第三季 - 01 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]';
    const title3 =
      '[Lilith-Raws] 死神少爷与黑女仆 / Shinigami Bocchan to Kuro Maid S03 - 01 [Baha][WebDL 1080p AVC AAC][CHT]';
    const title4 =
      '[Up to 21°C] 死神少爷与黑女仆 第三季 / Shinigami Bocchan to Kuro Maid 3rd Season - 25 (CR 1920x1080 AVC AAC MKV)';

    expect(mustNotContainMatch(false, rule, title1)).toBe(false);
    expect(mustNotContainMatch(false, rule, title2)).toBe(false);
    expect(mustNotContainMatch(false, rule, title3)).toBe(false);
    expect(mustNotContainMatch(false, rule, title4)).toBe(true);
  });
  it('wildcard mustContainMatch ?', () => {
    const rule = `[1?\\]`;

    const title1 =
      '[TOC] 狼与辛香料 MERCHANT MEETS THE WISE WOLF [09][1080P][AVC AAC][CHT][MP4]';
    const title2 =
      '[TOC] 狼与辛香料 MERCHANT MEETS THE WISE WOLF [10][1080P][AVC AAC][CHT][MP4]';
    const title3 =
      '[爱恋&漫猫字幕社][4月新番][狼与香辛料 行商邂逅贤狼][Spice and Wolf][13][720p][MP4][GB][简中]';
    const title4 =
      '[爱恋&漫猫字幕社][4月新番][狼与香辛料 行商邂逅贤狼][Spice and Wolf][13v2][720p][MP4][GB][简中]';

    expect(mustContainMatch(false, rule, title1)).toBe(false);
    expect(mustContainMatch(false, rule, title2)).toBe(true);
    expect(mustContainMatch(false, rule, title3)).toBe(true);
    expect(mustContainMatch(false, rule, title4)).toBe(false);
  });
  it('wildcard mustContainMatch *', () => {
    const rule = `[13*\\]`;

    const title1 =
      '[TOC] 狼与辛香料 MERCHANT MEETS THE WISE WOLF [09][1080P][AVC AAC][CHT][MP4]';
    const title2 =
      '[TOC] 狼与辛香料 MERCHANT MEETS THE WISE WOLF [10][1080P][AVC AAC][CHT][MP4]';
    const title3 =
      '[爱恋&漫猫字幕社][4月新番][狼与香辛料 行商邂逅贤狼][Spice and Wolf][13][720p][MP4][GB][简中]';
    const title4 =
      '[爱恋&漫猫字幕社][4月新番][狼与香辛料 行商邂逅贤狼][Spice and Wolf][13v2][720p][MP4][GB][简中]';

    expect(mustContainMatch(false, rule, title1)).toBe(false);
    expect(mustContainMatch(false, rule, title2)).toBe(false);
    expect(mustContainMatch(false, rule, title3)).toBe(true);
    expect(mustContainMatch(false, rule, title4)).toBe(true);
  });

  it('wildcard mustNotContainMatch and', () => {
    const charList = ['【', '】', '★', '！', '[', ']', '喵萌', '新番', '简日'];
    const rule = charList.join(' ');

    const title1 =
      '【喵萌奶茶屋】★04月新番★[竞轮少女！/ Rinkai!][10][1080p][简日双语][招募翻译时轴]';
    const title2 =
      '[喵萌奶茶屋&LoliHouse] 竞轮少女！/ Rinkai! - 03 [WebRip 1080p HEVC-10bit AAC][简繁日内封字幕]';

    expect(mustNotContainMatch(false, rule, title1)).toBe(false);
    expect(mustNotContainMatch(false, rule, title2)).toBe(true);
  });
  it('wildcard mustNotContainMatch or', () => {
    const charList = ['ANi', 'LoliHouse', 'Lilith-Raws'];
    const rule = charList.join('|');

    const title1 =
      '[LoliHouse] 死神少爷与黑女仆 / Shinigami Bocchan to Kuro Maid [25-36 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]';
    const title2 =
      '[ANi] 死神少爷与黑女仆 第三季 - 01 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]';
    const title3 =
      '[Lilith-Raws] 死神少爷与黑女仆 / Shinigami Bocchan to Kuro Maid S03 - 01 [Baha][WebDL 1080p AVC AAC][CHT]';
    const title4 =
      '[Up to 21°C] 死神少爷与黑女仆 第三季 / Shinigami Bocchan to Kuro Maid 3rd Season - 25 (CR 1920x1080 AVC AAC MKV)';

    expect(mustContainMatch(false, rule, title1)).toBe(true);
    expect(mustContainMatch(false, rule, title2)).toBe(true);
    expect(mustContainMatch(false, rule, title3)).toBe(true);
    expect(mustContainMatch(false, rule, title4)).toBe(false);
  });
  it('wildcard mustNotContainMatch ?', () => {
    const rule = `[1?\\]`;

    const title1 =
      '[TOC] 狼与辛香料 MERCHANT MEETS THE WISE WOLF [09][1080P][AVC AAC][CHT][MP4]';
    const title2 =
      '[TOC] 狼与辛香料 MERCHANT MEETS THE WISE WOLF [10][1080P][AVC AAC][CHT][MP4]';
    const title3 =
      '[爱恋&漫猫字幕社][4月新番][狼与香辛料 行商邂逅贤狼][Spice and Wolf][13][720p][MP4][GB][简中]';
    const title4 =
      '[爱恋&漫猫字幕社][4月新番][狼与香辛料 行商邂逅贤狼][Spice and Wolf][13v2][720p][MP4][GB][简中]';

    expect(mustNotContainMatch(false, rule, title1)).toBe(true);
    expect(mustNotContainMatch(false, rule, title2)).toBe(false);
    expect(mustNotContainMatch(false, rule, title3)).toBe(false);
    expect(mustNotContainMatch(false, rule, title4)).toBe(true);
  });
  it('wildcard mustNotContainMatch *', () => {
    const rule = `[13*\\]`;

    const title1 =
      '[TOC] 狼与辛香料 MERCHANT MEETS THE WISE WOLF [09][1080P][AVC AAC][CHT][MP4]';
    const title2 =
      '[TOC] 狼与辛香料 MERCHANT MEETS THE WISE WOLF [10][1080P][AVC AAC][CHT][MP4]';
    const title3 =
      '[爱恋&漫猫字幕社][4月新番][狼与香辛料 行商邂逅贤狼][Spice and Wolf][13][720p][MP4][GB][简中]';
    const title4 =
      '[爱恋&漫猫字幕社][4月新番][狼与香辛料 行商邂逅贤狼][Spice and Wolf][13v2][720p][MP4][GB][简中]';

    expect(mustNotContainMatch(false, rule, title1)).toBe(true);
    expect(mustNotContainMatch(false, rule, title2)).toBe(true);
    expect(mustNotContainMatch(false, rule, title3)).toBe(false);
    expect(mustNotContainMatch(false, rule, title4)).toBe(false);
  });

  it('regex mustContainMatch', () => {
    const rule = `爱恋.*\\[1\\d(v\\d)?\\]`;

    const title1 =
      '[TOC] 狼与辛香料 MERCHANT MEETS THE WISE WOLF [09][1080P][AVC AAC][CHT][MP4]';
    const title2 =
      '[TOC] 狼与辛香料 MERCHANT MEETS THE WISE WOLF [10][1080P][AVC AAC][CHT][MP4]';
    const title3 =
      '[爱恋&漫猫字幕社][4月新番][狼与香辛料 行商邂逅贤狼][Spice and Wolf][13][720p][MP4][GB][简中]';
    const title4 =
      '[爱恋&漫猫字幕社][4月新番][狼与香辛料 行商邂逅贤狼][Spice and Wolf][13v2][720p][MP4][GB][简中]';
    const title5 =
      '[爱恋&漫猫字幕社][4月新番][狼与香辛料 行商邂逅贤狼][Spice and Wolf][09][720p][MP4][GB][简中]';

    expect(mustContainMatch(true, rule, title1)).toBe(false);
    expect(mustContainMatch(true, rule, title2)).toBe(false);
    expect(mustContainMatch(true, rule, title3)).toBe(true);
    expect(mustContainMatch(true, rule, title4)).toBe(true);
    expect(mustContainMatch(true, rule, title5)).toBe(false);
  });
});
