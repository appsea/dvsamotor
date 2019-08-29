import { getResources } from "tns-core-modules/application";
import { FormattedString } from "tns-core-modules/text/formatted-string";
import { Span } from "tns-core-modules/text/span";

getResources().highlightSearch = (sentence, searchText, className) => {
    const formattedString = new FormattedString();
    if (sentence && sentence.trim() !== "") {
        if (!searchText) {
            const span = new Span();
            span.text = sentence;
            span.className = className;
            formattedString.spans.push(span);
        } else {
            const indexes: Array<number> = [];
            if (searchText && sentence) {
                let pos: number = sentence.toLowerCase().indexOf(searchText.toLowerCase());
                while (pos !== -1) {
                    indexes.push(pos);
                    pos = sentence.toLowerCase().indexOf(searchText.toLowerCase(), pos + searchText.length);
                }
            }
            const tokens: Array<string> = [];
            if (indexes.length > 0) {
                let start = 0;
                for (const item of indexes) {
                    tokens.push(sentence.substring(start, item));
                    start = item;
                    tokens.push(sentence.substring(start, start + searchText.length));
                    start = start + searchText.length;
                }
                tokens.push(sentence.substring(start));
            } else {
                tokens.push(sentence);
            }
            tokens.forEach((str) => {
                const span = new Span();
                span.text = str;
                if (str.toLocaleLowerCase() === searchText.toLowerCase()) {
                    if (className && className !== "") {
                        span.className = className + " highlight";
                    } else {
                        span.className = "highlight";
                    }
                } else if (className && className !== "") {
                    span.className = className;
                }
                formattedString.spans.push(span);
            });
        }
    }

    return formattedString;
};
