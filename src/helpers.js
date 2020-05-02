// /src/helpers.js

// For Leipzig.vue
export class Highlight {
    static highlight(tk, query, isRegex) {
        var query_arr = query.split(',').map(x => x.trim());
        
        // RegEx search
        if (isRegex) {
            for (var i=0; i<query_arr.length; i++) {
                var regex = RegExp(`(${query_arr[i]})`, "g");
                if (regex.test(tk)) {
                    tk = tk.replace(regex, myReplace);
                    break
                }
            }

        // Exact search
        } else {
            for (var j=0; j<query_arr.length; j++) {
                if (tk.includes(query_arr[j])) {
                    var regex2 = RegExp(`(${query_arr[j]})`, "g");
                    tk = tk.replace(regex2, myReplace);
                    break
                }
            }
        }

        return tk
    }

    static myReplace(str, group1) {
        return "<span class='matchedtoken'>" + group1 + "</span>"
    }
}
function myReplace(str, group1) {
    return "<span class='matchedtoken'>" + group1 + "</span>"
}