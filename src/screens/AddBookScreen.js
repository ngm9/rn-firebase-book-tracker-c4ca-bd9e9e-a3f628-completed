import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const GENRES = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology'];
const STATUSES = [
  { value: 'want_to_read', label: 'Want to Read' },
  { value: 'reading', label: 'Reading' },
  { value: 'finished', label: 'Finished' },
];

export default function AddBookScreen({ navigation, user }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Fiction');
  const [status, setStatus] = useState('want_to_read');
  const [pageCount, setPageCount] = useState('');
  const [rating, setRating] = useState('3');
  const [titleError, setTitleError] = useState('');
  const [authorError, setAuthorError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setTitleError('');
    setAuthorError('');

    let valid = true;
    if (!title.trim()) {
      setTitleError('Title is required.');
      valid = false;
    }
    if (!author.trim()) {
      setAuthorError('Author is required.');
      valid = false;
    }
    if (!valid) return;

    setSubmitting(true);
    try {
await addDoc(collection(db,'books'),{
  title:title.trim(),
  author:author.trim(),
  genre,
  status,
  pageCount: parseInt(pageCount,10) || 0,
  rating: parseInt(rating, 10|| 3,
                   uiserId: user.uid,
                   });  
      navigation.goBack();
    } catch (err) {
      console.error('Failed to add book', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Add a Book</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.form}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, titleError ? styles.inputError : null]}
            placeholder="Book title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />
          {titleError ? <Text style={styles.fieldError}>{titleError}</Text> : null}

          <Text style={styles.label}>Author</Text>
          <TextInput
            style={[styles.input, authorError ? styles.inputError : null]}
            placeholder="Author name"
            placeholderTextColor="#999"
            value={author}
            onChangeText={setAuthor}
          />
          {authorError ? <Text style={styles.fieldError}>{authorError}</Text> : null}

          <Text style={styles.label}>Genre</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {GENRES.map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.chip, genre === g && styles.chipSelected]}
                onPress={() => setGenre(g)}
              >
                <Text style={[styles.chipText, genre === g && styles.chipTextSelected]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Status</Text>
          <View style={styles.statusRow}>
            {STATUSES.map(s => (
              <TouchableOpacity
                key={s.value}
                style={[styles.statusOption, status === s.value && styles.statusOptionSelected]}
                onPress={() => setStatus(s.value)}
              >
                <Text style={[styles.statusOptionText, status === s.value && styles.statusOptionTextSelected]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Pages</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 320"
                placeholderTextColor="#999"
                value={pageCount}
                onChangeText={setPageCount}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Rating (1-5)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 4"
                placeholderTextColor="#999"
                value={rating}
                onChangeText={setRating}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>{submitting ? 'Saving...' : 'Save Book'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backText: {
    fontSize: 15,
    color: '#4361ee',
    fontWeight: '600',
    width: 60,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  form: {
    padding: 20,
    paddingBottom: 60,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1a1a2e',
  },
  inputError: {
    borderColor: '#e63946',
  },
  fieldError: {
    color: '#e63946',
    fontSize: 13,
    marginTop: 4,
  },
  chipScroll: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#4361ee',
    borderColor: '#4361ee',
  },
  chipText: {
    fontSize: 13,
    color: '#666',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  statusOptionSelected: {
    backgroundColor: '#4361ee',
    borderColor: '#4361ee',
  },
  statusOptionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statusOptionTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  button: {
    backgroundColor: '#4361ee',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
