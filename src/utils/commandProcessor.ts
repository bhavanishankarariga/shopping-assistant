export interface ParsedCommand {
  action: 'add' | 'remove' | 'search' | 'clear' | 'check' | 'uncheck' | 'unknown';
  item?: string;
  quantity?: number;
  unit?: string;
  searchQuery?: string;
}

const numberWords: Record<string, number> = {
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'a': 1, 'an': 1
};

const units = ['packet', 'packets', 'kg', 'kilogram', 'kilograms', 'liter', 'liters',
               'bottle', 'bottles', 'can', 'cans', 'box', 'boxes', 'bag', 'bags',
               'pound', 'pounds', 'lb', 'lbs', 'oz', 'ounce', 'ounces', 'gram', 'grams'];

export function processVoiceCommand(transcript: string): ParsedCommand {
  const lowerTranscript = transcript.toLowerCase().trim();

  if (lowerTranscript.includes('add') || lowerTranscript.includes('put') || lowerTranscript.includes('get')) {
    return parseAddCommand(lowerTranscript);
  }

  if (lowerTranscript.includes('remove') || lowerTranscript.includes('delete') || lowerTranscript.includes('take off')) {
    return parseRemoveCommand(lowerTranscript);
  }

  if (lowerTranscript.includes('find') || lowerTranscript.includes('search') || lowerTranscript.includes('show')) {
    return parseSearchCommand(lowerTranscript);
  }

  if (lowerTranscript.includes('check') || lowerTranscript.includes('mark')) {
    return parseCheckCommand(lowerTranscript);
  }

  if (lowerTranscript.includes('uncheck') || lowerTranscript.includes('unmark')) {
    return parseUncheckCommand(lowerTranscript);
  }

  if (lowerTranscript.includes('clear') || lowerTranscript.includes('remove all') || lowerTranscript.includes('delete all')) {
    return { action: 'clear' };
  }

  return { action: 'unknown' };
}

function parseAddCommand(transcript: string): ParsedCommand {
  let text = transcript.replace(/^(add|put|get)\s+/i, '').trim();

  let quantity = 1;
  let unit = 'item';

  const words = text.split(/\s+/);
  const firstWord = words[0];

  if (!isNaN(Number(firstWord))) {
    quantity = Number(firstWord);
    text = words.slice(1).join(' ');
  } else if (numberWords[firstWord]) {
    quantity = numberWords[firstWord];
    text = words.slice(1).join(' ');
  }

  for (const unitWord of units) {
    const regex = new RegExp(`\\b${unitWord}\\b`, 'i');
    if (regex.test(text)) {
      unit = unitWord.toLowerCase();
      text = text.replace(regex, '').trim();
      break;
    }
  }

  text = text.replace(/\s+of\s+/i, ' ').trim();

  return {
    action: 'add',
    item: text || 'item',
    quantity,
    unit
  };
}

function parseRemoveCommand(transcript: string): ParsedCommand {
  const text = transcript
    .replace(/^(remove|delete|take off)\s+/i, '')
    .trim();

  return {
    action: 'remove',
    item: text
  };
}

function parseSearchCommand(transcript: string): ParsedCommand {
  const text = transcript
    .replace(/^(find|search|show)\s+/i, '')
    .trim();

  return {
    action: 'search',
    searchQuery: text
  };
}

function parseCheckCommand(transcript: string): ParsedCommand {
  const text = transcript
    .replace(/^(check|mark)\s+(off\s+)?/i, '')
    .trim();

  return {
    action: 'check',
    item: text
  };
}

function parseUncheckCommand(transcript: string): ParsedCommand {
  const text = transcript
    .replace(/^(uncheck|unmark)\s+/i, '')
    .trim();

  return {
    action: 'uncheck',
    item: text
  };
}

export function categorizeItem(itemName: string, categories: Array<{ name: string; keywords: string[] }>): string {
  const lowerName = itemName.toLowerCase();

  for (const category of categories) {
    for (const keyword of category.keywords) {
      if (lowerName.includes(keyword.toLowerCase())) {
        return category.name;
      }
    }
  }

  return 'other';
}
